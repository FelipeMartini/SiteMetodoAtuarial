#!/bin/bash
# Script para instalar dependências do Redux Toolkit e outros packages necessários

cd /home/felipe/Área\ de\ Trabalho/GitHub/SiteMetodoAtuarial/nextjs-app

# Instalar Redux Toolkit e dependências relacionadas
npm install @reduxjs/toolkit react-redux redux-persist

# Instalar componentes de UI/UX inspirados no ArchitectUI
npm install @headlessui/react @heroicons/react framer-motion

# Instalar dependências de gráficos e charts
npm install recharts chart.js react-chartjs-2

# Instalar utilitários de manipulação de dados
npm install lodash date-fns

# Instalar tipagens TypeScript
npm install --save-dev @types/lodash

echo "Dependências instaladas com sucesso!"
