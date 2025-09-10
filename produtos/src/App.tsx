import React, { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  CardMedia,
  IconButton,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: string;
  imagem: string;
  categoria: string;
}

// Configurar faker para português brasileiro
// Na versão atual do faker, o locale é configurado na importação

// Categorias de produtos para gerar imagens temáticas
const categorias = [
  { nome: 'Alimentos', keywords: ['food', 'snack', 'grocery'] },
  { nome: 'Bebidas', keywords: ['drink', 'beverage', 'coffee'] },
  { nome: 'Limpeza', keywords: ['cleaning', 'soap', 'detergent'] },
  { nome: 'Higiene', keywords: ['cosmetics', 'beauty', 'hygiene'] },
  { nome: 'Casa', keywords: ['home', 'house', 'furniture'] },
  { nome: 'Eletrônicos', keywords: ['electronics', 'tech', 'gadget'] },
];

const gerarImagemAleatoria = (categoria: string): string => {
  const categoriaInfo = categorias.find(cat => cat.nome === categoria);
  const keyword = categoriaInfo?.keywords[Math.floor(Math.random() * categoriaInfo.keywords.length)] || 'product';
  const seed = Math.random().toString(36).substring(7);
  
  // Usando diferentes serviços de imagens aleatórias
  const servicos = [
    `https://picsum.photos/seed/${seed}/400/300`,
    `https://source.unsplash.com/400x300/?${keyword}`,
    `https://loremflickr.com/400/300/${keyword}?random=${Date.now()}`,
  ];
  
  return servicos[Math.floor(Math.random() * servicos.length)];
};

// Nomes de produtos brasileiros por categoria
const produtosBrasileiros = {
  'Alimentos': ['Arroz Tio João', 'Feijão Carioca', 'Macarrão Galo', 'Açúcar Cristal', 'Farinha de Trigo', 'Óleo de Soja', 'Biscoito Recheado', 'Pão de Açúcar'],
  'Bebidas': ['Coca-Cola', 'Guaraná Antarctica', 'Cerveja Skol', 'Suco Tang', 'Água Mineral', 'Café Pilão', 'Energético Red Bull', 'Achocolatado Nescau'],
  'Limpeza': ['Detergente Ypê', 'Sabão em Pó OMO', 'Amaciante Comfort', 'Desinfetante Pinho Sol', 'Papel Higiênico Neve', 'Esponja Scotch-Brite', 'Água Sanitária', 'Limpa Vidros'],
  'Higiene': ['Shampoo Seda', 'Sabonete Dove', 'Creme Dental Colgate', 'Desodorante Rexona', 'Absorvente Always', 'Fralda Pampers', 'Escova de Dente', 'Perfume Natura'],
  'Casa': ['Lâmpada LED', 'Pilha Duracell', 'Fita Adesiva', 'Cola Branca', 'Vela Aromática', 'Organizador Plástico', 'Pano de Prato', 'Toalha de Banho'],
  'Eletrônicos': ['Carregador USB', 'Fone de Ouvido', 'Cabo HDMI', 'Pendrive Kingston', 'Mouse Sem Fio', 'Teclado Gamer', 'Webcam HD', 'Caixa de Som Bluetooth']
};

const gerarProdutoAleatorio = (): Produto => {
  const categoria = categorias[Math.floor(Math.random() * categorias.length)];
  const nomesCategoria = produtosBrasileiros[categoria.nome as keyof typeof produtosBrasileiros];
  const nomeBase = nomesCategoria[Math.floor(Math.random() * nomesCategoria.length)];
  
  // Variações do nome
  const variacoes = ['500ml', '1L', '250g', '500g', '1kg', 'Grande', 'Médio', 'Pequeno', 'Premium', 'Tradicional'];
  const variacao = Math.random() > 0.5 ? ` ${variacoes[Math.floor(Math.random() * variacoes.length)]}` : '';
  
  return {
    id: faker.string.uuid(),
    nome: nomeBase + variacao,
    descricao: faker.lorem.sentence({ min: 4, max: 8 }),
    preco: `R$ ${faker.commerce.price({ min: 5, max: 100, dec: 2, symbol: '' }).replace('.', ',')}`,
    imagem: gerarImagemAleatoria(categoria.nome),
    categoria: categoria.nome,
  };
};

const gerarProdutosIniciais = (): Produto[] => [
  {
    id: '1',
    nome: 'Coca-Cola Lata 350ml',
    descricao: 'Refrigerante de cola tradicional, perfeito para refrescar.',
    preco: 'R$ 4,50',
    imagem: gerarImagemAleatoria('Bebidas'),
    categoria: 'Bebidas',
  },
  {
    id: '2',
    nome: 'Detergente Neutro 400ml',
    descricao: 'Detergente líquido para limpeza de louças e utensílios.',
    preco: 'R$ 3,80',
    imagem: gerarImagemAleatoria('Limpeza'),
    categoria: 'Limpeza',
  },
  {
    id: '3',
    nome: 'Leite Integral 1L',
    descricao: 'Leite integral longa vida, rico em nutrientes.',
    preco: 'R$ 5,20',
    imagem: gerarImagemAleatoria('Alimentos'),
    categoria: 'Alimentos',
  },
  {
    id: '4',
    nome: 'Pão de Açúcar 500g',
    descricao: 'Pão de forma tradicional, ideal para sanduíches.',
    preco: 'R$ 7,90',
    imagem: gerarImagemAleatoria('Alimentos'),
    categoria: 'Alimentos',
  },
  {
    id: '5',
    nome: 'Shampoo Anticaspa 400ml',
    descricao: 'Shampoo para cabelos com tendência à caspa.',
    preco: 'R$ 12,50',
    imagem: gerarImagemAleatoria('Higiene'),
    categoria: 'Higiene',
  },
  {
    id: '6',
    nome: 'Café Torrado e Moído 500g',
    descricao: 'Café tradicional brasileiro, torra média.',
    preco: 'R$ 8,75',
    imagem: gerarImagemAleatoria('Bebidas'),
    categoria: 'Bebidas',
  },
];

function App() {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  // Inicializar produtos na primeira renderização
  useEffect(() => {
    setProdutos(gerarProdutosIniciais());
  }, []);

  const handleAddToCart = (produto: Produto) => {
    console.log('Produto adicionado ao carrinho:', produto);
    const event = new CustomEvent('addToCart', { detail: JSON.stringify(produto) });
    window.dispatchEvent(event);
  };

  const adicionarProdutoAleatorio = () => {
    const novoProduto = gerarProdutoAleatorio();
    setProdutos(prev => [...prev, novoProduto]);
  };

  const renovarImagens = () => {
    const produtosAtualizados = produtos.map(produto => ({
      ...produto,
      imagem: gerarImagemAleatoria(produto.categoria),
    }));
    setProdutos(produtosAtualizados);
  };

  const resetarProdutos = () => {
    setProdutos(gerarProdutosIniciais());
  };

  return (
    <div>
      {/* Controles */}
      <Grid container spacing={2} sx={{ p: 2, mt: 10 }} justifyContent="center">
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={adicionarProdutoAleatorio}
            startIcon={<RefreshIcon />}
          >
            Adicionar Produto Aleatório
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="secondary"
            onClick={renovarImagens}
            startIcon={<RefreshIcon />}
          >
            Renovar Imagens
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            onClick={resetarProdutos}
          >
            Resetar Produtos
          </Button>
        </Grid>
      </Grid>

      {/* Lista de Produtos */}
      <Grid container spacing={2} sx={{ p: 2 }}>
        {produtos.map((produto) => (
          <Grid item xs={12} sm={6} md={4} key={produto.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={produto.imagem}
                alt={produto.nome}
                sx={{ objectFit: 'cover' }}
                onError={(e) => {
                  // Fallback para imagem quebrada
                  const target = e.target as HTMLImageElement;
                  target.src = `https://picsum.photos/seed/${produto.id}/400/300`;
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {produto.nome}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {produto.descricao}
                </Typography>
                <Typography variant="caption" display="block" gutterBottom>
                  Categoria: {produto.categoria}
                </Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {produto.preco}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddToCart(produto)}
                  fullWidth
                >
                  Adicionar ao Carrinho
                </Button>
                <IconButton
                  size="small"
                  onClick={() => {
                    const produtosAtualizados = produtos.map(p =>
                      p.id === produto.id
                        ? { ...p, imagem: gerarImagemAleatoria(p.categoria) }
                        : p
                    );
                    setProdutos(produtosAtualizados);
                  }}
                  title="Trocar imagem"
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default App;