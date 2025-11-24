<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
    <Card class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-2 mb-4">
          <span class="material-symbols-outlined text-primary-600 text-4xl">bakery_dining</span>
          <h1 class="text-4xl font-bold text-primary-600">BakeWise</h1>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          {{ isLogin ? 'Bem-vindo' : 'Criar Conta' }}
        </h2>
        <p class="text-gray-600">
          {{ isLogin ? 'Entre na sua conta' : 'Cadastre seu estabelecimento' }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="!isLogin">
          <Label>Nome Completo</Label>
          <Input v-model="formData.nome" type="text" placeholder="Seu nome" required />
        </div>

        <div v-if="!isLogin">
          <Label>Nome do Estabelecimento</Label>
          <Input v-model="formData.nomeEstabelecimento" type="text" placeholder="Nome da confeitaria" required />
        </div>

        <div>
          <Label>Usuário</Label>
          <Input v-model="formData.username" type="text" placeholder="seu.usuario" required />
        </div>

        <div>
          <Label>Senha</Label>
          <Input v-model="formData.senha" type="password" placeholder="••••••••" required />
        </div>

        <ErrorText v-if="erro">{{ erro }}</ErrorText>

        <Button type="submit" :disabled="loading" fullWidth>
          <span v-if="!loading">{{ isLogin ? 'Entrar' : 'Cadastrar' }}</span>
          <span v-else>Carregando...</span>
        </Button>
      </form>

      <div class="mt-6 text-center">
        <button @click="isLogin = !isLogin" class="text-primary-600 hover:text-primary-700 font-medium">
          {{ isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login' }}
        </button>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Button, Input, Label, Card, ErrorText } from '../components/StyledComponents';
import * as authService from '../services/authService';

const router = useRouter();
const isLogin = ref(true);
const loading = ref(false);
const erro = ref('');

const formData = ref({
  nome: '',
  nomeEstabelecimento: '',
  username: '',
  senha: ''
});

const handleSubmit = async () => {
  loading.value = true;
  erro.value = '';

  try {
    let result;
    if (isLogin.value) {
      result = await authService.login(formData.value.username, formData.value.senha);
    } else {
      result = await authService.registrar(formData.value);
    }

    authService.salvarAuth(result.token, result.user);
    router.push('/dashboard');
  } catch (error) {
    erro.value = error.response?.data?.erro || 'Erro ao processar requisição';
  } finally {
    loading.value = false;
  }
};
</script>
