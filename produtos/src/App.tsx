import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CardMedia,
} from '@mui/material';

const produtos = [
  { nome: 'Produto 1', descricao: 'Descrição do Produto 1', preco: 'R$ 50,00' },
  { nome: 'Produto 2', descricao: 'Descrição do Produto 2', preco: 'R$ 75,00' },
  { nome: 'Produto 3', descricao: 'Descrição do Produto 3', preco: 'R$ 100,00' },
];

function App() {
  const handleAddToCart = (produto: string) => {
    console.log('Produto adicionado ao carrinho:',produtos.find(x => x.nome == produto));
    const event = new CustomEvent('addToCart', { detail: JSON.stringify(produtos.find(x => x.nome == produto)) });
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
              image={`https://via.placeholder.com/150?text=${produto.nome}`}
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
                onClick={() => handleAddToCart(produto.nome)}
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
