# Microfrontends com Module Federation

Microfrontends é uma abordagem para dividir uma aplicação frontend em várias partes menores e independentes, cada uma responsável por uma funcionalidade específica. Isso permite que equipes diferentes trabalhem em partes diferentes da aplicação de forma independente, facilitando a manutenção e a escalabilidade.

## Module Federation

Module Federation é um recurso do Webpack 5 que permite que diferentes aplicações compartilhem módulos entre si em tempo de execução. Isso é especialmente útil para microfrontends, pois permite que diferentes partes da aplicação sejam carregadas dinamicamente de diferentes fontes.

### Como Funciona o Module Federation

#### Configuração do Module Federation

Cada aplicação (ou microfrontend) é configurada para expor e consumir módulos usando o `ModuleFederationPlugin` do Webpack. Por exemplo, a aplicação principal (`app`) pode consumir módulos expostos pelas aplicações `carrinho` e `produtos`.

#### Exposição de Módulos

Cada microfrontend expõe seus módulos para que possam ser consumidos por outras aplicações. Por exemplo, a aplicação `carrinho` pode expor um módulo `CarrinhoModule` que pode ser consumido pela aplicação principal.

#### Consumo de Módulos

A aplicação principal consome os módulos expostos pelos microfrontends. Por exemplo, a aplicação principal pode consumir o módulo `CarrinhoModule` exposto pela aplicação `carrinho`.

## Como Está Sendo Feito o Deploy

### Build e Deploy Independente

Cada microfrontend é construído e implantado de forma independente. Isso permite que cada equipe trabalhe e implante suas mudanças sem afetar outras partes da aplicação.

### Uso de Buckets S3 e CloudFront

Os arquivos estáticos de cada microfrontend são armazenados em diferentes pastas dentro do mesmo bucket S3. As distribuições CloudFront são usadas para servir esses arquivos estáticos de forma eficiente.

### GitHub Actions

GitHub Actions é usado para automatizar o processo de build e deploy. Cada vez que uma mudança é feita no código de um microfrontend, o GitHub Actions constrói e implanta essa mudança automaticamente.

## Comportamento da Aplicação

### Carregamento Dinâmico

A aplicação principal carrega dinamicamente os módulos dos microfrontends usando o Module Federation. Isso permite que a aplicação principal seja pequena e carregue apenas os módulos necessários em tempo de execução.

### Independência e Isolamento

Cada microfrontend é independente e isolado, o que facilita a manutenção e a escalabilidade. Mudanças em um microfrontend não afetam diretamente os outros microfrontends.

### Comunicação entre Microfrontends

A comunicação entre microfrontends pode ser feita usando eventos ou um estado compartilhado. Por exemplo, a aplicação principal pode disparar um evento para abrir o carrinho de compras, que é um módulo carregado dinamicamente.

## Exemplo de Comportamento

### Aplicação Principal (`app`)

- Carrega dinamicamente o módulo `CarrinhoModule` exposto pela aplicação `carrinho`.
- Carrega dinamicamente o módulo `ProdutosModule` exposto pela aplicação `produtos`.

### Aplicação `carrinho`

- Expõe o módulo `CarrinhoModule` que pode ser consumido pela aplicação principal.

### Aplicação `produtos`

- Expõe o módulo `ProdutosModule` que pode ser consumido pela aplicação principal.

## Benefícios

- **Escalabilidade**: Permite que diferentes equipes trabalhem em diferentes partes da aplicação de forma independente.
- **Manutenção**: Facilita a manutenção, pois cada microfrontend é isolado e pode ser atualizado independentemente.
- **Desempenho**: Melhora o desempenho, pois a aplicação principal carrega apenas os módulos necessários em tempo de execução.

## Conclusão

O uso de microfrontends com Module Federation permite uma arquitetura modular e escalável, onde diferentes partes da aplicação podem ser desenvolvidas, implantadas e mantidas de forma independente. Isso resulta em uma aplicação mais flexível e fácil de gerenciar.