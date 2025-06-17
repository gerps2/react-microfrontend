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

## Como Executar o Projeto

Este projeto utiliza um Makefile para facilitar a configuração e execução da aplicação. O Makefile assume que você tem o NVM (Node Version Manager) instalado em sua máquina.

### Comandos Disponíveis

```bash
# Mostrar ajuda com todos os comandos disponíveis
make help

# Configurar o ambiente com a versão correta do Node.js
make setup

# Instalar todas as dependências dos microfrontends
make install

# Iniciar a aplicação completa (todos os microfrontends)
make start

# Remover node_modules e outros arquivos temporários
make clean
```

### Conteúdo do Makefile

```makefile
# Makefile para configuracao e execucao da aplicacao React Microfrontend
# Assume que o NVM esta instalado na maquina

# Definicao de variaveis
NODE_VERSION = 20.11.1
NPM_VERSION = 9.8.1

# Definicao de comandos

.PHONY: help setup install start clean

# Ajuda
help:
	@echo "=== React Microfrontend - Comandos Disponiveis ==="
	@echo "make setup    - Configura o ambiente com a versao correta do Node.js e NPM"
	@echo "make install  - Instala todas as dependencias dos microfrontends"
	@echo "make start    - Inicia a aplicacao completa (todos os microfrontends)"
	@echo "make clean    - Remove node_modules e outros arquivos temporarios"

# Configuracao do ambiente
setup:
	@echo "Configurando ambiente de desenvolvimento..."
	@echo "Usando NVM para configurar Node.js v$(NODE_VERSION)"
	@powershell -Command "if (Get-Command nvm -ErrorAction SilentlyContinue) { exit 0 } else { Write-Host 'NVM nao encontrado. Por favor, instale o NVM antes de continuar.' -ForegroundColor Red; exit 1 }"
	@nvm install $(NODE_VERSION)
	@nvm use $(NODE_VERSION)
	@echo "Node.js v$(NODE_VERSION) configurado com sucesso!"
	@echo "Verificando versao do NPM..."
	@npm --version
	@echo "Ambiente configurado com sucesso!"

# Instalacao de dependencias
install: setup
	@echo "Instalando dependencias..."
	@echo "Instalando dependencias do projeto principal..."
	@npm install --no-fund --no-audit
	@echo "Instalando dependencias do microfrontend App..."
	@cd app && npm install --no-fund --no-audit --force
	@echo "Instalando dependencias do microfrontend Carrinho..."
	@cd carrinho && npm install --no-fund --no-audit --force
	@echo "Instalando dependencias do microfrontend Produtos..."
	@cd produtos && npm install --no-fund --no-audit --force
	@echo "Todas as dependencias foram instaladas com sucesso!"

# Iniciar a aplicação
start: install
	@echo "Iniciando a aplicacao React Microfrontend..."
	@echo "Isso iniciara todos os microfrontends simultaneamente."
	@echo "A aplicacao estara disponivel em http://localhost:8083"
	@npm run start:all

# Limpeza
clean:
	@echo "Limpando arquivos temporarios..."
	@echo "Removendo node_modules do projeto principal..."
	@rm -rf node_modules
	@echo "Removendo node_modules do microfrontend App..."
	@rm -rf app/node_modules
	@echo "Removendo node_modules do microfrontend Carrinho..."
	@rm -rf carrinho/node_modules
	@echo "Removendo node_modules do microfrontend Produtos..."
	@rm -rf produtos/node_modules
	@echo "Limpeza concluida!"
```

### Requisitos

- NVM (Node Version Manager)
- Node.js v20.11.1 (instalado automaticamente pelo Makefile via NVM)
- NPM v10.2.4 (vem com o Node.js)

### Observações

O Makefile usa a flag `--force` durante a instalação das dependências para contornar possíveis incompatibilidades entre as versões dos pacotes. Isso é necessário porque alguns pacotes como `react-router` e `react-router-dom` na versão 7.0.2 requerem Node.js 20.0.0 ou superior.