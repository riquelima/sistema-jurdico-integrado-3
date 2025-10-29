CREATE TABLE `acoes_civeis` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`client_name` text NOT NULL,
	`type` text NOT NULL,
	`current_step` integer DEFAULT 0,
	`status` text DEFAULT 'Em Andamento' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`rnm_mae` text,
	`rnm_pai` text,
	`rnm_suposto_pai` text,
	`cpf_mae` text,
	`cpf_pai` text,
	`certidao_nascimento` text,
	`comprovante_endereco` text,
	`passaporte` text,
	`guia_paga` text,
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `acoes_criminais` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`client_name` text NOT NULL,
	`status` text DEFAULT 'Em Andamento' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `acoes_trabalhistas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`client_name` text NOT NULL,
	`status` text DEFAULT 'Em Andamento' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `alerts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`module_type` text NOT NULL,
	`record_id` integer NOT NULL,
	`alert_for` text NOT NULL,
	`message` text NOT NULL,
	`is_read` integer DEFAULT false,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `compra_venda_imoveis` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`numero_matricula` text,
	`cadastro_contribuinte` text,
	`endereco_imovel` text,
	`rg_vendedores` text,
	`cpf_vendedores` text,
	`data_nascimento_vendedores` text,
	`rnm_comprador` text,
	`cpf_comprador` text,
	`endereco_comprador` text,
	`current_step` integer DEFAULT 0,
	`status` text DEFAULT 'Em Andamento' NOT NULL,
	`prazo_sinal` text,
	`prazo_escritura` text,
	`contract_notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`module_type` text NOT NULL,
	`record_id` integer NOT NULL,
	`file_name` text NOT NULL,
	`file_path` text NOT NULL,
	`file_type` text NOT NULL,
	`uploaded_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `perda_nacionalidade` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`client_name` text NOT NULL,
	`rnm_mae` text,
	`rnm_pai` text,
	`cpf_mae` text,
	`cpf_pai` text,
	`certidao_nascimento` text,
	`comprovante_endereco` text,
	`passaportes` text,
	`documento_chines` text,
	`traducao_juramentada` text,
	`current_step` integer DEFAULT 0,
	`status` text DEFAULT 'Em Andamento' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `vistos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`client_name` text NOT NULL,
	`type` text NOT NULL,
	`cpf` text,
	`rnm` text,
	`passaporte` text,
	`comprovante_endereco` text,
	`certidao_nascimento_filhos` text,
	`cartao_cnpj` text,
	`contrato_empresa` text,
	`escritura_imoveis` text,
	`reservas_passagens` text,
	`reservas_hotel` text,
	`seguro_viagem` text,
	`roteiro_viagem` text,
	`taxa` text,
	`status` text DEFAULT 'Em Andamento' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
