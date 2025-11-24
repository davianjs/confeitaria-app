<template>
  <nav class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center gap-8">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary-600 text-2xl">bakery_dining</span>
            <div class="flex flex-col">
              <h1 class="text-xl font-bold text-primary-600">BakeWise</h1>
              <span class="text-xs text-gray-600" v-if="nomeEstabelecimento">{{ nomeEstabelecimento }}</span>
            </div>
          </div>
          
          <!-- Desktop Menu -->
          <div class="hidden md:flex gap-4">
            <router-link 
              to="/dashboard" 
              class="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
              :class="$route.path === '/dashboard' ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'"
            >
              <span class="material-symbols-outlined text-xl">dashboard</span>
              <span class="font-medium">Dashboard</span>
            </router-link>
            
            <router-link 
              to="/insumos" 
              class="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
              :class="$route.path === '/insumos' ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'"
            >
              <span class="material-symbols-outlined text-xl">inventory_2</span>
              <span class="font-medium">Insumos</span>
            </router-link>
            
            <router-link 
              to="/produtos" 
              class="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
              :class="$route.path === '/produtos' ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'"
            >
              <span class="material-symbols-outlined text-xl">cake</span>
              <span class="font-medium">Produtos</span>
            </router-link>
            
            <router-link 
              to="/vendas" 
              class="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
              :class="$route.path === '/vendas' ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'"
            >
              <span class="material-symbols-outlined text-xl">shopping_cart</span>
              <span class="font-medium">Vendas</span>
            </router-link>
          </div>
        </div>

        <!-- Desktop Logout Button -->
        <Button variant="secondary" size="sm" @click="$emit('logout')" class="hidden md:inline-flex">
          <span class="material-symbols-outlined">logout</span>
          Sair
        </Button>

        <!-- Mobile Menu Button -->
        <button 
          @click="menuAberto = !menuAberto"
          class="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <span class="material-symbols-outlined text-2xl">
            {{ menuAberto ? 'close' : 'menu' }}
          </span>
        </button>
      </div>

      <!-- Mobile Menu Dropdown -->
      <div 
        v-if="menuAberto"
        class="md:hidden border-t py-4 space-y-2"
      >
        <router-link 
          to="/dashboard" 
          @click="menuAberto = false"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
          :class="$route.path === '/dashboard' ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:bg-gray-50'"
        >
          <span class="material-symbols-outlined text-xl">dashboard</span>
          <span class="font-medium">Dashboard</span>
        </router-link>
        
        <router-link 
          to="/insumos" 
          @click="menuAberto = false"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
          :class="$route.path === '/insumos' ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:bg-gray-50'"
        >
          <span class="material-symbols-outlined text-xl">inventory_2</span>
          <span class="font-medium">Insumos</span>
        </router-link>
        
        <router-link 
          to="/produtos" 
          @click="menuAberto = false"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
          :class="$route.path === '/produtos' ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:bg-gray-50'"
        >
          <span class="material-symbols-outlined text-xl">cake</span>
          <span class="font-medium">Produtos</span>
        </router-link>
        
        <router-link 
          to="/vendas" 
          @click="menuAberto = false"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
          :class="$route.path === '/vendas' ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:bg-gray-50'"
        >
          <span class="material-symbols-outlined text-xl">shopping_cart</span>
          <span class="font-medium">Vendas</span>
        </router-link>

        <button 
          @click="$emit('logout')"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
        >
          <span class="material-symbols-outlined text-xl">logout</span>
          <span>Sair</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { Button } from './StyledComponents';

defineProps({
  nomeEstabelecimento: {
    type: String,
    default: ''
  }
});

defineEmits(['logout']);

const menuAberto = ref(false);
</script>
