import React from 'react';

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  CardMedia,
} from '@mui/material';

interface Produto {
  nome: string;
  descricao: string;
  preco: string;
  imagem: string;
}

const produtos: Produto[] = [
  {
    nome: 'Coca-Cola',
    descricao: 'Refrigerante popular no Brasil.',
    preco: 'R$ 7,00',
    imagem: 'https://bretas.vtexassets.com/arquivos/ids/205215/6573285e593b93f6a6e1151d.jpg?v=638376425945070000',
  },
  {
    nome: 'Detergente Ypê',
    descricao: 'Detergente líquido para limpeza de louças.',
    preco: 'R$ 3,50',
    imagem: 'https://acdn-us.mitiendanube.com/stores/001/387/654/products/ype-transparente1-88a1b51e52e32c88a816347339910442-640-0.jpg',
  },
  {
    nome: 'Leite Italac',
    descricao: 'Leite integral da marca Italac.',
    preco: 'R$ 4,00',
    imagem: 'https://tb1304.vtexassets.com/arquivos/ids/194321/Leite-longa-vida-italac-integral-c-tampa-1L.jpg?v=638089746079530000',
  },
  {
    nome: 'Leite Italac',
    descricao: 'Leite integral da marca Italac.',
    preco: 'R$ 4,00',
    imagem: 'https://tb1304.vtexassets.com/arquivos/ids/194321/Leite-longa-vida-italac-integral-c-tampa-1L.jpg?v=638089746079530000',
  },
];

function App() {
  const handleAddToCart = (produto: Produto) => {
    console.log('Produto adicionado ao carrinho:', produto);
    const event = new CustomEvent('addToCart', { detail: JSON.stringify(produto) });
    window.dispatchEvent(event);
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }} marginTop={'100px'}>
      {produtos.map((produto, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image={produto.imagem}
              alt={produto.nome}
            />
            <CardContent>
              <Typography variant="h6">{produto.nome}</Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {produto.descricao}
              </Typography>
              <Typography variant="subtitle1" color="primary">
                {produto.preco}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => handleAddToCart(produto)}
              >
                Adicionar ao Carrinho
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default App;