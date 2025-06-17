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
    imagem: 'https://tb0932.vtexassets.com/arquivos/ids/162850/101810.png?v=637705338309930000',
  },
  {
    nome: 'Leite Italac',
    descricao: 'Leite integral da marca Italac.',
    preco: 'R$ 4,00',
    imagem: 'https://www.italac.com.br/wp-content/uploads/2015/07/UHT_INTEGRAL_BASE_1L-1024x1024.png',
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
