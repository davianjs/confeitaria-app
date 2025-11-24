<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar :nomeEstabelecimento="nomeEstabelecimento" @logout="handleLogout" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <div class="flex items-center gap-2 md:gap-3 mb-2">
            <span class="material-symbols-outlined text-2xl md:text-3xl text-primary-600">inventory_2</span>
            <h2 class="text-xl md:text-2xl font-bold text-gray-800">Gestão de Insumos</h2>
          </div>
          <p class="text-sm md:text-base text-gray-600">Gerencie os ingredientes e matérias-primas</p>
        </div>
        <Button @click="abrirModalCriar" size="sm">
          <span class="material-symbols-outlined">add</span>
          <span class="hidden sm:inline">Novo Insumo</span>
          <span class="sm:hidden">Novo</span>
        </Button>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Carregando...</p>
      </div>

      <div v-else-if="insumos.length === 0" class="text-center py-12">
        <span class="material-symbols-outlined text-6xl text-gray-400 mb-4">inventory_2</span>
        <p class="text-gray-600">Nenhum insumo cadastrado</p>
      </div>

      <div v-else>
        <!-- Desktop Table -->
        <Card class="hidden md:block overflow-x-auto">
          <Table>
            <thead>
              <tr>
                <Th>Nome</Th>
                <Th>Unidade</Th>
                <Th>Estoque</Th>
                <Th>Custo Unitário</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="insumo in insumos" :key="insumo._id">
                <Td>{{ insumo.nome }}</Td>
                <Td>{{ insumo.unidadeMedida }}</Td>
                <Td>
                  <Badge :variant="insumo.quantidadeEstoque < 10 ? 'warning' : 'success'">
                    {{ insumo.quantidadeEstoque }}
                  </Badge>
                </Td>
                <Td>R$ {{ formatarMoeda(insumo.custoUnitario) }}</Td>
                <Td>
                  <div class="flex gap-2">
                    <button @click="abrirModalEditar(insumo)" 
                            class="text-blue-600 hover:text-blue-700">
                      <span class="material-symbols-outlined text-xl">edit</span>
                    </button>
                    <button @click="confirmarDeletar(insumo)" 
                            class="text-red-600 hover:text-red-700">
                      <span class="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </div>
                </Td>
              </tr>
            </tbody>
          </Table>
        </Card>

        <!-- Mobile Cards -->
        <div class="md:hidden space-y-4">
          <Card v-for="insumo in insumos" :key="insumo._id">
            <div class="flex justify-between items-start mb-3">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-800 text-base">{{ insumo.nome }}</h3>
                <p class="text-sm text-gray-500 mt-1">{{ insumo.unidadeMedida }}</p>
              </div>
              <Badge :variant="insumo.quantidadeEstoque < 10 ? 'warning' : 'success'">
                {{ insumo.quantidadeEstoque }}
              </Badge>
            </div>
            
            <div class="flex justify-between items-center pt-3 border-t">
              <span class="text-sm font-medium text-gray-700">R$ {{ formatarMoeda(insumo.custoUnitario) }}</span>
              <div class="flex gap-2">
                <button @click="abrirModalEditar(insumo)" 
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <span class="material-symbols-outlined text-xl">edit</span>
                </button>
                <button @click="confirmarDeletar(insumo)" 
                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <span class="material-symbols-outlined text-xl">delete</span>
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>

    <Modal v-if="modalAberto" @click.self="fecharModal">
      <ModalContent @click.stop>
        <div class="p-4 md:p-6">
          <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">
            {{ insumoEditando ? 'Editar Insumo' : 'Novo Insumo' }}
          </h3>

          <form @submit.prevent="salvarInsumo" class="space-y-4">
            <div>
              <Label>Nome do Insumo</Label>
              <Input v-model="formData.nome" type="text" placeholder="Ex: Farinha de Trigo" required />
            </div>

            <div>
              <Label>Unidade de Medida</Label>
              <Select v-model="formData.unidadeMedida" required>
                <option value="">Selecione</option>
                <option value="kg">Quilograma (kg)</option>
                <option value="g">Grama (g)</option>
                <option value="L">Litro (L)</option>
                <option value="ml">Mililitro (ml)</option>
                <option value="un">Unidade (un)</option>
              </Select>
            </div>

            <div>
              <Label>Quantidade em Estoque</Label>
              <Input v-model.number="formData.quantidadeEstoque" type="number" step="0.01" min="0" required />
            </div>

            <div>
              <Label>Custo Unitário (R$)</Label>
              <Input v-model.number="formData.custoUnitario" type="number" step="0.01" min="0" required />
            </div>

            <ErrorText v-if="erro">{{ erro }}</ErrorText>

            <div class="flex gap-3 pt-4">
              <Button type="submit" :disabled="salvando" fullWidth>
                {{ salvando ? 'Salvando...' : 'Salvar' }}
              </Button>
              <Button type="button" variant="secondary" @click="fecharModal" :disabled="salvando" fullWidth>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </ModalContent>
    </Modal>

    <ConfirmDialog
      :isOpen="confirmDialog.isOpen"
      :type="confirmDialog.type"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      @confirm="confirmDialog.onConfirm"
      @cancel="handleDialogCancel"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Button, Card, Table, Th, Td, Badge, Modal, ModalContent, Input, Select, Label, ErrorText } from '../components/StyledComponents';
import NavBar from '../components/NavBar.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import * as insumoService from '../services/insumoService';
import * as authService from '../services/authService';

const router = useRouter();
const loading = ref(true);
const insumos = ref([]);
const modalAberto = ref(false);
const insumoEditando = ref(null);
const salvando = ref(false);
const erro = ref('');
const nomeEstabelecimento = ref('');
const confirmDialog = ref({
  isOpen: false,
  type: 'confirm',
  title: '',
  message: '',
  onConfirm: null
});

const formData = ref({
  nome: '',
  unidadeMedida: '',
  quantidadeEstoque: 0,
  custoUnitario: 0
});

const formatarMoeda = (valor) => {
  return valor.toFixed(2).replace('.', ',');
};

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};

const carregarInsumos = async () => {
  try {
    insumos.value = await insumoService.listarInsumos();
  } catch (error) {
    console.error('Erro ao carregar insumos:', error);
  } finally {
    loading.value = false;
  }
};

const abrirModalCriar = () => {
  insumoEditando.value = null;
  formData.value = {
    nome: '',
    unidadeMedida: '',
    quantidadeEstoque: 0,
    custoUnitario: 0
  };
  erro.value = '';
  modalAberto.value = true;
};

const abrirModalEditar = (insumo) => {
  insumoEditando.value = insumo;
  formData.value = {
    nome: insumo.nome,
    unidadeMedida: insumo.unidadeMedida,
    quantidadeEstoque: insumo.quantidadeEstoque,
    custoUnitario: insumo.custoUnitario
  };
  erro.value = '';
  modalAberto.value = true;
};

const fecharModal = () => {
  modalAberto.value = false;
  insumoEditando.value = null;
  erro.value = '';
};

const salvarInsumo = async () => {
  salvando.value = true;
  erro.value = '';

  try {
    if (insumoEditando.value) {
      await insumoService.atualizarInsumo(insumoEditando.value._id, formData.value);
    } else {
      await insumoService.criarInsumo(formData.value);
    }
    await carregarInsumos();
    fecharModal();
  } catch (error) {
    erro.value = error.response?.data?.erro || 'Erro ao salvar insumo';
  } finally {
    salvando.value = false;
  }
};

const confirmarDeletar = (insumo) => {
  confirmDialog.value = {
    isOpen: true,
    type: 'confirm',
    title: 'Confirmar Exclusão',
    message: `Tem certeza que deseja deletar "${insumo.nome}"? Esta ação não pode ser desfeita.`,
    onConfirm: async () => {
      try {
        await insumoService.deletarInsumo(insumo._id);
        await carregarInsumos();
        confirmDialog.value.isOpen = false;
      } catch (error) {
        confirmDialog.value = {
          isOpen: true,
          type: 'error',
          title: 'Erro ao Deletar',
          message: error.response?.data?.erro || 'Erro ao deletar insumo',
          onConfirm: () => { confirmDialog.value.isOpen = false; }
        };
      }
    }
  };
};

const handleDialogCancel = () => {
  confirmDialog.value.isOpen = false;
};

onMounted(async () => {
  const user = authService.getUser();
  if (user) {
    nomeEstabelecimento.value = user.nomeEstabelecimento;
  }
  await carregarInsumos();
});
</script>
