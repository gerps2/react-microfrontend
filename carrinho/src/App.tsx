import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  Divider,
  IconButton,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: string;
  categoria?: string;
}

function App() {
  const [items, setItems] = useState<Produto[]>([]);

  useEffect(() => {
    const handleAddToCart = (event: CustomEvent) => {
      console.log('Evento recebido no carrinho:', event);
      try {
        const produto: Produto = JSON.parse(event.detail);
        console.log('Produto adicionado ao carrinho:', produto);
        setItems((prevItems) => [...prevItems, produto]);
      } catch (error) {
        console.error('Erro ao processar o produto do evento:', error);
      }
    };

    window.addEventListener('addToCart', handleAddToCart as EventListener);

    return () => {
      window.removeEventListener('addToCart', handleAddToCart as EventListener);
    };
  }, []);

  const handleRemoveItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleFinalizePurchase = () => {
    alert('Compra finalizada com sucesso!');
    setItems([]);
  };

  return (
    <Box
      sx={{
        width: '300px',
        minHeight: '100vh',
        position: 'fixed',
        right: 0,
        top: 0,
        backgroundColor: '#f5f5f5',
        borderLeft: '1px solid #ddd',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        padding: '16px',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Carrinho de Compras
      </Typography>
      <Divider sx={{ my: 2 }} />
      <List>
        {items.length > 0 ? (
          items.map((item, index) => (
            <ListItem
              key={item.id || index}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleRemoveItem(index)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={item.nome}
                secondary={
                  <Box>
                    <Typography variant="body2">
                      {item.preco}
                    </Typography>
                    {item.categoria && (
                      <Typography variant="caption" color="textSecondary">
                        {item.categoria}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            O carrinho está vazio.
          </Typography>
        )}
      </List>
      {items.length > 0 && (
        <Box mt={2}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mb: 1 }}
            onClick={handleFinalizePurchase}
          >
            Finalizar Compra
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={() => setItems([])}
          >
            Esvaziar Carrinho
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default App;