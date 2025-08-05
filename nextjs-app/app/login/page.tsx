"use client";

import React, { Suspense } from "react";
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Container, Flex, Texto } from '../../styles/ComponentesBase';

const SocialLoginBox = React.lazy(() => import("../components/SocialLoginBox"));

const LoginPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <Container>
        <Flex
          $direction="column"
          $align="center"
          $justify="center"
          style={{ minHeight: '100vh', padding: '32px 0' }}
        >
          <div style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>
            <Texto
              $variante="h3"
              $peso="negrito"
              $align="centro"
              style={{ marginBottom: 32, color: '#4F46E5' }}
            >
              Login
            </Texto>
            <Suspense fallback={<div>Carregando login social...</div>}>
              <SocialLoginBox />
            </Suspense>
          </div>
        </Flex>
      </Container>
    </ErrorBoundary>
  );
};

export default LoginPage;
