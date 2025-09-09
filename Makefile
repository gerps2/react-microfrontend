NODE_VERSION = 20.11.1
NPM_VERSION = 9.8.1

.PHONY: help setup install start clean aws-configure terraform-init terraform-plan terraform-apply terraform-destroy build-all deploy-local

help:
	@echo "=== React Microfrontend - Comandos Disponiveis ==="
	@echo "make setup    - Configura o ambiente com a versao correta do Node.js e NPM"
	@echo "make install  - Instala todas as dependencias dos microfrontends"
	@echo "make start    - Inicia a aplicacao completa (todos os microfrontends)"
	@echo "make clean    - Remove node_modules e outros arquivos temporarios"
	@echo ""
	@echo "=== AWS e Terraform - Comandos Disponiveis ==="
	@echo "make aws-configure    - Configura as credenciais da AWS localmente"
	@echo "make terraform-init    - Inicializa o Terraform"
	@echo "make terraform-plan    - Cria um plano de execucao do Terraform"
	@echo "make terraform-apply   - Aplica as mudancas na infraestrutura AWS"
	@echo "make terraform-destroy - Destroi toda a infraestrutura criada na AWS"
	@echo ""
	@echo "=== Build e Deploy Local - Comandos Disponiveis ==="
	@echo "make build-all     - Compila todos os microfrontends"
	@echo "make deploy-local  - Compila e faz deploy dos microfrontends para a AWS"

setup:
	@echo "Configurando ambiente de desenvolvimento..."
	@echo "Verificando Node.js..."
	@if command -v node > /dev/null; then \
		node_version=$$(node -v | cut -d 'v' -f2); \
		echo "Node.js $$node_version encontrado"; \
		if [ "$$node_version" != "$(NODE_VERSION)" ]; then \
			echo "AVISO: A versao atual do Node.js ($$node_version) e diferente da recomendada ($(NODE_VERSION))."; \
			echo "Para instalar a versao recomendada, execute manualmente:"; \
			echo "  source $(brew --prefix)/opt/nvm/nvm.sh && nvm install $(NODE_VERSION) && nvm use $(NODE_VERSION)"; \
		fi; \
	else \
		echo "Node.js nao encontrado. Por favor, instale o Node.js v$(NODE_VERSION)."; \
		echo "Se voce tem o NVM instalado, execute manualmente:"; \
		echo "  source $(brew --prefix)/opt/nvm/nvm.sh && nvm install $(NODE_VERSION) && nvm use $(NODE_VERSION)"; \
		exit 1; \
	fi
	@echo "Verificando versao do NPM..."
	@npm --version
	@echo "Ambiente configurado com sucesso!"

install: setup
	@echo "Instalando dependencias..."
	@echo "Instalando dependencias do projeto principal..."
	@npm install --no-fund --no-audit
	@cd app && echo "Instalando dependencias do microfrontend App..." && npm install --no-fund --no-audit --force
	@cd carrinho && echo "Instalando dependencias do microfrontend Carrinho..." && npm install --no-fund --no-audit --force
	@cd produtos && echo "Instalando dependencias do microfrontend Produtos..." && npm install --no-fund --no-audit --force
	@echo "Todas as dependencias foram instaladas com sucesso!"

start: install
	@echo "Iniciando a aplicacao React Microfrontend..."
	@echo "Isso iniciara todos os microfrontends simultaneamente."
	@echo "A aplicacao estara disponivel em http://localhost:8083"
	@npm run start:all

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

aws-configure:
	@echo "=== Configurando credenciais da AWS ==="
	@echo "Voce sera solicitado a fornecer suas credenciais da AWS"
	@aws configure
	@echo "Credenciais AWS configuradas com sucesso!"

terraform-init:
	@echo "=== Inicializando Terraform ==="
	@cd terraform && terraform init
	@echo "Terraform inicializado com sucesso!"

terraform-plan: terraform-init
	@echo "=== Planejando infraestrutura com Terraform ==="
	@cd terraform && terraform plan -out=tfplan
	@echo "Plano de execucao do Terraform gerado com sucesso!"

terraform-apply: terraform-plan
	@echo "=== Aplicando infraestrutura com Terraform ==="
	@cd terraform && terraform apply "tfplan"
	@echo "Infraestrutura aplicada com sucesso!"
	@cd terraform && terraform output

terraform-destroy:
	@echo "=== ATENCAO: Destruindo toda a infraestrutura ==="
	@echo "Esta acao vai remover todos os recursos criados na AWS"
	@read -p "Tem certeza que deseja continuar? (y/n): " confirm && [[ $$confirm == [yY] || $$confirm == [yY][eE][sS] ]] || exit 1
	@cd terraform && terraform destroy -auto-approve
	@echo "Infraestrutura destruida com sucesso!"

build-all:
	@echo "=== Compilando todos os microfrontends ==="
	@PRODUCTION_DOMAIN=$$(cd terraform && terraform output -raw app_distribution_domain_name) && \
	echo "Usando domínio de produção: https://$$PRODUCTION_DOMAIN" && \
	echo "Compilando app..." && \
	cd app && PRODUCTION_DOMAIN=https://$$PRODUCTION_DOMAIN npm run build && \
	echo "Compilando carrinho..." && \
	cd ../carrinho && PRODUCTION_DOMAIN=https://$$PRODUCTION_DOMAIN npm run build && \
	echo "Compilando produtos..." && \
	cd ../produtos && PRODUCTION_DOMAIN=https://$$PRODUCTION_DOMAIN npm run build
	@echo "Todos os microfrontends compilados com sucesso!"

get-bucket-name:
	@cd terraform && terraform output -raw s3_bucket_name

deploy-local: build-all
	@echo "=== Fazendo deploy local para AWS ==="
	@BUCKET_NAME=$$(cd terraform && terraform output -raw s3_bucket_name) && \
	echo "Fazendo upload dos arquivos para o bucket $$BUCKET_NAME" && \
	aws s3 sync app/dist/ s3://$$BUCKET_NAME/app/latest/ --delete && \
	aws s3 sync carrinho/dist/ s3://$$BUCKET_NAME/carrinho/latest/ --delete && \
	aws s3 sync produtos/dist/ s3://$$BUCKET_NAME/produtos/latest/ --delete && \
	echo "Copiando index.html principal para a raiz..." && \
	aws s3 cp s3://$$BUCKET_NAME/app/latest/index.html s3://$$BUCKET_NAME/index.html
	@echo "Invalidando cache do CloudFront..."
	@DIST_ID=$$(cd terraform && terraform output -raw app_distribution_id) && \
	aws cloudfront create-invalidation --distribution-id $$DIST_ID --paths "/*"
	@echo "Deploy concluído com sucesso!"
	@echo "URL da aplicação: https://$$(cd terraform && terraform output -raw app_distribution_domain_name)"
