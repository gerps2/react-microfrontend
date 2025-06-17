import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import { Drawer, Box, Container, CssBaseline } from '@mui/material';
import './reset.css';


const [CarrinhoLazy, ProdutosLazy] = [
  'Carrinho',
  'Produtos',
].map(app => lazy(() => import(`./components/${app}`)));

function App() {
  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <CssBaseline />
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1201,
            backgroundColor: 'primary.main',
          }}
        >
          <Header />
        </Box>

        <Container maxWidth="lg" sx={{ flex: 1, mt: 2, mb: 2 }}>
          <ProdutosLazy />
        </Container>

        <Box>
          <CarrinhoLazy />
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;