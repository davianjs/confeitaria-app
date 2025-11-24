<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar :nomeEstabelecimento="nomeEstabelecimento" @logout="handleLogout" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <div class="flex items-center gap-2 md:gap-3 mb-2">
            <span class="material-symbols-outlined text-2xl md:text-3xl text-primary-600">shopping_cart</span>
            <h2 class="text-xl md:text-2xl font-bold text-gray-800">Gestão de Vendas</h2>
          </div>
          <p class="text-sm md:text-base text-gray-600">Registre e acompanhe suas vendas</p>
        </div>
        <Button @click="abrirModalVenda" size="sm">
          <span class="material-symbols-outlined">add_shopping_cart</span>
          <span class="hidden sm:inline">Nova Venda</span>
          <span class="sm:hidden">Venda</span>
        </Button>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Carregando...</p>
      </div>

      <div v-else-if="vendas.length === 0" class="text-center py-12">
        <span class="material-symbols-outlined text-6xl text-gray-400 mb-4">receipt_long</span>
        <p class="text-gray-600">Nenhuma venda registrada</p>
      </div>

      <div v-else class="mb-6">
        <!-- Desktop Table -->
        <Card class="hidden md:block overflow-x-auto">
          <Table>
            <thead>
              <tr>
                <Th>Data</Th>
                <Th>Produto</Th>
                <Th>Quantidade</Th>
                <Th>Valor Total</Th>
                <Th>Lucro</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="venda in vendas" :key="venda._id">
                <Td>{{ formatarData(venda.createdAt) }}</Td>
                <Td>{{ venda.produtoSnapshot.nome }}</Td>
                <Td>{{ venda.quantidade }}</Td>
                <Td>R$ {{ formatarMoeda(venda.valorTotal) }}</Td>
                <Td>
                  <span class="font-medium text-green-600">
                    R$ {{ formatarMoeda(venda.lucro) }}
                  </span>
                </Td>
                <Td>
                  <button @click="verDetalhes(venda)" 
                          class="text-blue-600 hover:text-blue-700">
                    <span class="material-symbols-outlined text-xl">visibility</span>
                  </button>
                </Td>
              </tr>
            </tbody>
          </Table>
        </Card>

        <!-- Mobile Cards -->
        <div class="md:hidden space-y-4">
          <Card v-for="venda in vendas" :key="venda._id">
            <div class="flex justify-between items-start mb-3">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-800 text-base">{{ venda.produtoSnapshot.nome }}</h3>
                <p class="text-xs text-gray-500 mt-1">{{ formatarData(venda.createdAt) }}</p>
              </div>
              <button @click="verDetalhes(venda)" 
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <span class="material-symbols-outlined text-xl">visibility</span>
              </button>
            </div>
            
            <div class="grid grid-cols-2 gap-3 pt-3 border-t text-sm">
              <div>
                <p class="text-gray-500 text-xs">Quantidade</p>
                <p class="font-medium text-gray-800">{{ venda.quantidade }}x</p>
              </div>
              <div>
                <p class="text-gray-500 text-xs">Valor Total</p>
                <p class="font-medium text-gray-800">R$ {{ formatarMoeda(venda.valorTotal) }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-gray-500 text-xs">Lucro</p>
                <p class="font-semibold text-green-600">R$ {{ formatarMoeda(venda.lucro) }}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>

    <Modal v-if="modalVendaAberto" @click.self="fecharModalVenda">
      <ModalContent @click.stop>
        <div class="p-4 md:p-6">
          <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Nova Venda</h3>

          <form @submit.prevent="registrarNovaVenda" class="space-y-4">
            <div>
              <Label>Selecione o Produto</Label>
              <Select v-model="vendaForm.produtoId" required>
                <option value="">Escolha um produto</option>
                <option v-for="produto in produtos" :key="produto._id" :value="produto._id">
                  {{ produto.nome }} - R$ {{ formatarMoeda(produto.precoVenda) }}
                </option>
              </Select>
            </div>

            <div>
              <Label>Quantidade</Label>
              <Input v-model.number="vendaForm.quantidade" type="number" min="1" required />
            </div>

            <div v-if="vendaForm.produtoId" class="bg-gray-50 p-4 rounded-lg">
              <p class="text-sm text-gray-600 mb-2">Resumo da Venda</p>
              <div class="space-y-1">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-700">Valor unitário:</span>
                  <span class="text-sm font-medium">R$ {{ formatarMoeda(getProdutoSelecionado()?.precoVenda || 0) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-700">Quantidade:</span>
                  <span class="text-sm font-medium">{{ vendaForm.quantidade }}</span>
                </div>
                <div class="flex justify-between pt-2 border-t">
                  <span class="font-medium text-gray-800">Total:</span>
                  <span class="font-bold text-primary-600">
                    R$ {{ formatarMoeda((getProdutoSelecionado()?.precoVenda || 0) * vendaForm.quantidade) }}
                  </span>
                </div>
              </div>
            </div>

            <ErrorText v-if="erro">{{ erro }}</ErrorText>

            <div class="flex gap-3 pt-4">
              <Button type="submit" :disabled="salvando" variant="success" fullWidth>
                {{ salvando ? 'Processando...' : 'Confirmar Venda' }}
              </Button>
              <Button type="button" variant="secondary" @click="fecharModalVenda" :disabled="salvando" fullWidth>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </ModalContent>
    </Modal>

    <Modal v-if="modalDetalhesAberto" @click.self="fecharModalDetalhes">
      <ModalContent @click.stop>
        <div class="p-4 md:p-6">
          <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Detalhes da Venda</h3>

          <div v-if="vendaSelecionada" class="space-y-4">
            <div>
              <p class="text-sm text-gray-600">Data da Venda</p>
              <p class="font-medium">{{ formatarData(vendaSelecionada.createdAt) }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-600">Produto</p>
              <p class="font-medium">{{ vendaSelecionada.produtoSnapshot.nome }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-600">Quantidade Vendida</p>
              <p class="font-medium">{{ vendaSelecionada.quantidade }}</p>
            </div>

            <div class="border-t pt-4">
              <p class="text-sm text-gray-600 mb-3">Ingredientes Utilizados</p>
              <div class="space-y-2">
                <div v-for="(ing, index) in vendaSelecionada.produtoSnapshot.ingredientes" :key="index"
                     class="flex justify-between text-sm">
                  <span>{{ ing.nomeInsumo }}</span>
                  <span class="text-gray-600">{{ ing.quantidade }} un</span>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-700">Custo Total:</span>
                <span class="font-medium">R$ {{ formatarMoeda(vendaSelecionada.produtoSnapshot.custoTotal * vendaSelecionada.quantidade) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-700">Valor de Venda:</span>
                <span class="font-medium">R$ {{ formatarMoeda(vendaSelecionada.valorTotal) }}</span>
              </div>
              <div class="flex justify-between pt-2 border-t">
                <span class="font-bold text-gray-800">Lucro:</span>
                <span class="font-bold text-green-600">R$ {{ formatarMoeda(vendaSelecionada.lucro) }}</span>
              </div>
            </div>

            <Button @click="fecharModalDetalhes" fullWidth>Fechar</Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Button, Card, Table, Th, Td, Modal, ModalContent, Input, Select, Label, ErrorText } from '../components/StyledComponents';
import NavBar from '../components/NavBar.vue';
import * as vendaService from '../services/vendaService';
import * as produtoService from '../services/produtoService';
import * as authService from '../services/authService';

const router = useRouter();
const loading = ref(true);
const vendas = ref([]);
const produtos = ref([]);
const modalVendaAberto = ref(false);
const modalDetalhesAberto = ref(false);
const vendaSelecionada = ref(null);
const salvando = ref(false);
const erro = ref('');
const nomeEstabelecimento = ref('');

const vendaForm = ref({
  produtoId: '',
  quantidade: 1
});

const formatarMoeda = (valor) => {
  return valor.toFixed(2).replace('.', ',');
};

const formatarData = (data) => {
  return new Date(data).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};

const carregarDados = async () => {
  try {
    const [vendasData, produtosData] = await Promise.all([
      vendaService.listarVendas(),
      produtoService.listarProdutos()
    ]);
    vendas.value = vendasData;
    produtos.value = produtosData;
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  } finally {
    loading.value = false;
  }
};

const abrirModalVenda = () => {
  vendaForm.value = {
    produtoId: '',
    quantidade: 1
  };
  erro.value = '';
  modalVendaAberto.value = true;
};

const fecharModalVenda = () => {
  modalVendaAberto.value = false;
  erro.value = '';
};

const getProdutoSelecionado = () => {
  return produtos.value.find(p => p._id === vendaForm.value.produtoId);
};

const registrarNovaVenda = async () => {
  salvando.value = true;
  erro.value = '';

  try {
    await vendaService.registrarVenda(vendaForm.value.produtoId, vendaForm.value.quantidade);
    await carregarDados();
    fecharModalVenda();
  } catch (error) {
    erro.value = error.response?.data?.erro || 'Erro ao registrar venda';
  } finally {
    salvando.value = false;
  }
};

const verDetalhes = (venda) => {
  vendaSelecionada.value = venda;
  modalDetalhesAberto.value = true;
};

const fecharModalDetalhes = () => {
  modalDetalhesAberto.value = false;
  vendaSelecionada.value = null;
};

onMounted(async () => {
  const user = authService.getUser();
  if (user) {
    nomeEstabelecimento.value = user.nomeEstabelecimento;
  }
  await carregarDados();
});
</script>
