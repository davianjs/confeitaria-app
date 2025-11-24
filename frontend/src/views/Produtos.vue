<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar :nomeEstabelecimento="nomeEstabelecimento" @logout="handleLogout" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <div class="flex items-center gap-2 md:gap-3 mb-2">
            <span class="material-symbols-outlined text-2xl md:text-3xl text-primary-600">cake</span>
            <h2 class="text-xl md:text-2xl font-bold text-gray-800">Catálogo de Produtos</h2>
          </div>
          <p class="text-sm md:text-base text-gray-600">Gerencie suas receitas e produtos</p>
        </div>
        <Button @click="abrirModalCriar" size="sm">
          <span class="material-symbols-outlined">add</span>
          <span class="hidden sm:inline">Novo Produto</span>
          <span class="sm:hidden">Novo</span>
        </Button>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Carregando...</p>
      </div>

      <div v-else-if="produtos.length === 0" class="text-center py-12">
        <span class="material-symbols-outlined text-6xl text-gray-400 mb-4">cake</span>
        <p class="text-gray-600">Nenhum produto cadastrado</p>
      </div>

      <div v-else>
        <!-- Desktop Table -->
        <Card class="hidden md:block overflow-x-auto">
          <Table>
            <thead>
              <tr>
                <Th>Nome</Th>
                <Th>Descrição</Th>
                <Th>Ingredientes</Th>
                <Th>Preço de Venda</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="produto in produtos" :key="produto._id">
                <Td>{{ produto.nome }}</Td>
                <Td>{{ produto.descricao || '-' }}</Td>
                <Td>
                  <Badge>{{ produto.ingredientes.length }} insumos</Badge>
                </Td>
                <Td>R$ {{ formatarMoeda(produto.precoVenda) }}</Td>
                <Td>
                  <div class="flex gap-2">
                    <button @click="abrirModalEditar(produto)" 
                            class="text-blue-600 hover:text-blue-700">
                      <span class="material-symbols-outlined text-xl">edit</span>
                    </button>
                    <button @click="confirmarDeletar(produto)" 
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
          <Card v-for="produto in produtos" :key="produto._id">
            <div class="flex justify-between items-start mb-2">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-800 text-base">{{ produto.nome }}</h3>
                <p class="text-sm text-gray-500 mt-1">{{ produto.descricao || 'Sem descrição' }}</p>
              </div>
            </div>
            
            <div class="flex gap-2 mb-3">
              <Badge>{{ produto.ingredientes.length }} insumos</Badge>
            </div>
            
            <div class="flex justify-between items-center pt-3 border-t">
              <span class="text-sm font-medium text-green-600">R$ {{ formatarMoeda(produto.precoVenda) }}</span>
              <div class="flex gap-2">
                <button @click="abrirModalEditar(produto)" 
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <span class="material-symbols-outlined text-xl">edit</span>
                </button>
                <button @click="confirmarDeletar(produto)" 
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
            {{ produtoEditando ? 'Editar Produto' : 'Novo Produto' }}
          </h3>

          <form @submit.prevent="salvarProduto" class="space-y-4">
            <div>
              <Label>Nome do Produto</Label>
              <Input v-model="formData.nome" type="text" placeholder="Ex: Bolo de Chocolate" required />
            </div>

            <div>
              <Label>Descrição</Label>
              <Input v-model="formData.descricao" type="text" placeholder="Descrição opcional" />
            </div>

            <div>
              <Label>Preço de Venda (R$)</Label>
              <Input v-model.number="formData.precoVenda" type="number" step="0.01" min="0" required />
            </div>

            <div v-if="formData.ingredientes.length > 0 && custoTotalReceita > 0" 
                 class="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <h4 class="text-sm font-semibold text-blue-800 mb-2">Análise de Custos</h4>
              <div class="flex justify-between text-sm">
                <span class="text-blue-700">Custo Total dos Insumos:</span>
                <span class="font-semibold text-blue-900">R$ {{ formatarMoeda(custoTotalReceita) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-blue-700">Preço de Venda:</span>
                <span class="font-semibold text-blue-900">R$ {{ formatarMoeda(formData.precoVenda || 0) }}</span>
              </div>
              <div class="border-t border-blue-200 pt-2 mt-2">
                <div class="flex justify-between text-sm">
                  <span class="text-blue-700">Margem de Lucro:</span>
                  <span :class="margemLucro.valor >= 0 ? 'text-green-600' : 'text-red-600'" 
                        class="font-bold">
                    R$ {{ formatarMoeda(margemLucro.valor) }}
                  </span>
                </div>
                <div class="flex justify-between text-sm mt-1">
                  <span class="text-blue-700">Percentual de Lucro:</span>
                  <span :class="margemLucro.percentual >= 0 ? 'text-green-600' : 'text-red-600'" 
                        class="font-bold">
                    {{ margemLucro.percentual.toFixed(1) }}%
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-3">
                <Label>Ingredientes</Label>
                <button type="button" @click="adicionarIngrediente" 
                        class="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  + Adicionar
                </button>
              </div>

              <div v-for="(ing, index) in formData.ingredientes" :key="index" 
                   class="flex gap-2 mb-3">
                <Select v-model="ing.insumo" required class="flex-1">
                  <option value="">Selecione o insumo</option>
                  <option v-for="insumo in insumosDisponiveis" :key="insumo._id" :value="insumo._id">
                    {{ insumo.nome }} ({{ insumo.unidadeMedida }})
                  </option>
                </Select>
                <Input v-model.number="ing.quantidade" type="number" step="0.01" min="0.01" 
                       placeholder="Qtd" required class="w-24" />
                <button type="button" @click="removerIngrediente(index)" 
                        class="text-red-600 hover:text-red-700">
                  <span class="material-symbols-outlined">close</span>
                </button>
              </div>

              <p v-if="formData.ingredientes.length === 0" class="text-gray-500 text-sm">
                Adicione pelo menos um ingrediente
              </p>
            </div>

            <ErrorText v-if="erro">{{ erro }}</ErrorText>

            <div class="flex gap-3 pt-4">
              <Button type="submit" :disabled="salvando || formData.ingredientes.length === 0" fullWidth>
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Button, Card, Table, Th, Td, Badge, Modal, ModalContent, Input, Select, Label, ErrorText } from '../components/StyledComponents';
import NavBar from '../components/NavBar.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import * as produtoService from '../services/produtoService';
import * as insumoService from '../services/insumoService';
import * as authService from '../services/authService';

const router = useRouter();
const loading = ref(true);
const produtos = ref([]);
const insumosDisponiveis = ref([]);
const modalAberto = ref(false);
const produtoEditando = ref(null);
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
  descricao: '',
  precoVenda: 0,
  ingredientes: []
});

const formatarMoeda = (valor) => {
  return valor.toFixed(2).replace('.', ',');
};

const custoTotalReceita = computed(() => {
  let custo = 0;
  for (const ing of formData.value.ingredientes) {
    if (ing.insumo && ing.quantidade > 0) {
      const insumo = insumosDisponiveis.value.find(i => i._id === ing.insumo);
      if (insumo) {
        custo += insumo.custoUnitario * ing.quantidade;
      }
    }
  }
  return custo;
});

const margemLucro = computed(() => {
  const custo = custoTotalReceita.value;
  const preco = formData.value.precoVenda || 0;
  if (custo === 0) return { valor: 0, percentual: 0 };
  const lucro = preco - custo;
  const percentual = ((lucro / custo) * 100);
  return { valor: lucro, percentual };
});

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};

const carregarDados = async () => {
  try {
    const [produtosData, insumosData] = await Promise.all([
      produtoService.listarProdutos(),
      insumoService.listarInsumos()
    ]);
    produtos.value = produtosData;
    insumosDisponiveis.value = insumosData;
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  } finally {
    loading.value = false;
  }
};

const abrirModalCriar = () => {
  produtoEditando.value = null;
  formData.value = {
    nome: '',
    descricao: '',
    precoVenda: 0,
    ingredientes: []
  };
  erro.value = '';
  modalAberto.value = true;
};

const abrirModalEditar = (produto) => {
  produtoEditando.value = produto;
  formData.value = {
    nome: produto.nome,
    descricao: produto.descricao || '',
    precoVenda: produto.precoVenda,
    ingredientes: produto.ingredientes.map(ing => ({
      insumo: ing.insumo._id,
      quantidade: ing.quantidade
    }))
  };
  erro.value = '';
  modalAberto.value = true;
};

const fecharModal = () => {
  modalAberto.value = false;
  produtoEditando.value = null;
  erro.value = '';
};

const adicionarIngrediente = () => {
  formData.value.ingredientes.push({
    insumo: '',
    quantidade: 0
  });
};

const removerIngrediente = (index) => {
  formData.value.ingredientes.splice(index, 1);
};

const salvarProduto = async () => {
  salvando.value = true;
  erro.value = '';

  try {
    if (produtoEditando.value) {
      await produtoService.atualizarProduto(produtoEditando.value._id, formData.value);
    } else {
      await produtoService.criarProduto(formData.value);
    }
    await carregarDados();
    fecharModal();
  } catch (error) {
    erro.value = error.response?.data?.erro || 'Erro ao salvar produto';
  } finally {
    salvando.value = false;
  }
};

const confirmarDeletar = (produto) => {
  confirmDialog.value = {
    isOpen: true,
    type: 'confirm',
    title: 'Confirmar Exclusão',
    message: `Tem certeza que deseja deletar "${produto.nome}"? Esta ação não pode ser desfeita.`,
    onConfirm: async () => {
      try {
        await produtoService.deletarProduto(produto._id);
        await carregarDados();
        confirmDialog.value.isOpen = false;
      } catch (error) {
        confirmDialog.value = {
          isOpen: true,
          type: 'error',
          title: 'Erro ao Deletar',
          message: error.response?.data?.erro || 'Erro ao deletar produto',
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
  await carregarDados();
});
</script>
