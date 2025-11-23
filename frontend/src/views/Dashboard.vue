<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar :nomeEstabelecimento="nomeEstabelecimento" @logout="handleLogout" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div class="mb-6 md:mb-8">
        <div class="flex items-center gap-2 md:gap-3 mb-2">
          <span class="material-symbols-outlined text-2xl md:text-3xl text-primary-600">dashboard</span>
          <h2 class="text-xl md:text-2xl font-bold text-gray-800">Dashboard</h2>
        </div>
        <p class="text-sm md:text-base text-gray-600">Visão geral do seu negócio</p>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Carregando...</p>
      </div>

      <div v-else-if="estatisticas">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-xs md:text-sm font-medium">Total de Vendas</p>
                <p class="text-2xl md:text-3xl font-bold text-gray-800 mt-1 md:mt-2">{{ estatisticas.resumo.totalVendas }}</p>
              </div>
              <span class="material-symbols-outlined text-3xl md:text-4xl text-primary-500">shopping_cart</span>
            </div>
          </Card>

          <Card>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-xs md:text-sm font-medium">Receita Total</p>
                <p class="text-2xl md:text-3xl font-bold text-green-600 mt-1 md:mt-2">R$ {{ formatarMoeda(estatisticas.resumo.receitaTotal) }}</p>
              </div>
              <span class="material-symbols-outlined text-3xl md:text-4xl text-green-500">payments</span>
            </div>
          </Card>

          <Card>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-xs md:text-sm font-medium">Lucro Total</p>
                <p class="text-2xl md:text-3xl font-bold text-blue-600 mt-1 md:mt-2">R$ {{ formatarMoeda(estatisticas.resumo.lucroTotal) }}</p>
              </div>
              <span class="material-symbols-outlined text-3xl md:text-4xl text-blue-500">trending_up</span>
            </div>
          </Card>

          <Card>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-xs md:text-sm font-medium">Produtos</p>
                <p class="text-2xl md:text-3xl font-bold text-gray-800 mt-1 md:mt-2">{{ estatisticas.resumo.totalProdutos }}</p>
              </div>
              <span class="material-symbols-outlined text-3xl md:text-4xl text-purple-500">cake</span>
            </div>
          </Card>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <h3 class="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4">Mês Atual</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Vendas</span>
                <span class="font-bold text-gray-800">{{ estatisticas.mesAtual.vendas }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Receita</span>
                <span class="font-bold text-green-600">R$ {{ formatarMoeda(estatisticas.mesAtual.receita) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Lucro</span>
                <span class="font-bold text-blue-600">R$ {{ formatarMoeda(estatisticas.mesAtual.lucro) }}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 class="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4">Produtos Mais Vendidos</h3>
            <div class="space-y-3">
              <div v-for="produto in estatisticas.produtosMaisVendidos" :key="produto.nome" 
                   class="flex justify-between items-center">
                <div>
                  <p class="font-medium text-gray-800">{{ produto.nome }}</p>
                  <p class="text-sm text-gray-600">{{ produto.quantidadeVendida }} unidades</p>
                </div>
                <span class="font-bold text-green-600">R$ {{ formatarMoeda(produto.receita) }}</span>
              </div>
              <p v-if="estatisticas.produtosMaisVendidos.length === 0" class="text-gray-500 text-center py-4">
                Nenhuma venda registrada ainda
              </p>
            </div>
          </Card>
        </div>

        <Card v-if="estatisticas.insumosComEstoqueBaixo.length > 0">
          <div class="flex items-center gap-2 mb-3 md:mb-4">
            <span class="material-symbols-outlined text-yellow-600 text-xl md:text-2xl">warning</span>
            <h3 class="text-base md:text-lg font-bold text-gray-800">Insumos com Estoque Baixo</h3>
          </div>
          <div class="space-y-2">
            <div v-for="insumo in estatisticas.insumosComEstoqueBaixo" :key="insumo._id"
                 class="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span class="font-medium text-gray-800">{{ insumo.nome }}</span>
              <Badge variant="warning">{{ insumo.quantidadeEstoque }} {{ insumo.unidadeMedida }}</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Card, Badge } from '../components/StyledComponents.js';
import NavBar from '../components/NavBar.vue';
import * as dashboardService from '../services/dashboardService.js';
import * as authService from '../services/authService.js';

const router = useRouter();
const loading = ref(true);
const estatisticas = ref(null);
const nomeEstabelecimento = ref('');

const formatarMoeda = (valor) => {
  return valor.toFixed(2).replace('.', ',');
};

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};

onMounted(async () => {
  const user = authService.getUser();
  if (user) {
    nomeEstabelecimento.value = user.nomeEstabelecimento;
  }

  try {
    estatisticas.value = await dashboardService.obterEstatisticas();
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error);
  } finally {
    loading.value = false;
  }
});
</script>
