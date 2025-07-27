# API com TypeScript

```bash
mkdir items-api
cd items-api
npm init -y
```

## Instalar dependências

Essas são as dependências básicas do sistema

```bash
npm install express typeorm reflect-metadata pg dotenv
```

Depois vamos instalar as dependências de desenvolvimento:

```bash
npm install -D typescript ts-node-dev @types/node @types/express
```

## 1.3 Configurar TypeScript

```bash
npx tsc --init
```

Modifique o `tsconfig.json`:

```json
{
  "target": "ES2020",
  "module": "commonjs",
  "rootDir": "src",
  "outDir": "dist",
  "esModuleInterop": true,
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true,
  "strict": true
}
```

# Estrutura de Pastas (Padrão MVC)

```bash
src/
│
├── config/          # Configuração (TypeORM, .env)
├── controllers/     # Lida com requisições HTTP
├── entities/        # Entidades do banco (TypeORM)
├── routes/          # Define rotas da aplicação
├── services/        # Regras de negócio
├── database/        # Conexões, migrations (se necessário)
└── index.ts         # Arquivo principal da aplicação
```

## Arquivo `.env`

Utilizamos o arquivo `.env` para armazenar secrets durante o desenvolvimento

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=itemsdb
PORT=3000
```

## Conexão com banco `src/config/data-source.ts`

```ts
import { DataSource } from "typeorm";
import { Item } from "../entities/Item";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [Item],
});
```

## Criar Entidade `Item`

`src/entities/Item.ts`

```ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;
}
```

## Service `src/services/ItemService.ts`

```ts
import { AppDataSource } from "../config/data-source";
import { Item } from "../entities/Item";

const itemRepo = AppDataSource.getRepository(Item);

export class ItemService {
  static async findAll() {
    return itemRepo.find();
  }

  static async findById(id: number) {
    return itemRepo.findOneBy({ id });
  }

  static async create(data: Partial<Item>) {
    const item = itemRepo.create(data);
    return itemRepo.save(item);
  }

  static async update(id: number, data: Partial<Item>) {
    await itemRepo.update(id, data);
    return itemRepo.findOneBy({ id });
  }

  static async delete(id: number) {
    return itemRepo.delete(id);
  }
}
```

## Controller `src/controllers/ItemController.ts`

```ts
import { Request, Response } from "express";
import { ItemService } from "../services/ItemService";

export class ItemController {
  static async index(req: Request, res: Response) {
    const items = await ItemService.findAll();
    return res.json(items);
  }

  static async show(req: Request, res: Response) {
    const item = await ItemService.findById(Number(req.params.id));
    if (!item) return res.status(404).json({ message: "Item not found" });
    return res.json(item);
  }

  static async store(req: Request, res: Response) {
    const item = await ItemService.create(req.body);
    return res.status(201).json(item);
  }

  static async update(req: Request, res: Response) {
    const updated = await ItemService.update(Number(req.params.id), req.body);
    return res.json(updated);
  }

  static async destroy(req: Request, res: Response) {
    await ItemService.delete(Number(req.params.id));
    return res.status(204).send();
  }
}
```

---

## Rotas `src/routes/item.routes.ts`

```ts
import { Router } from "express";
import { ItemController } from "../controllers/ItemController";

const router = Router();

router.get("/", ItemController.index);
router.get("/:id", ItemController.show);
router.post("/", ItemController.store);
router.put("/:id", ItemController.update);
router.delete("/:id", ItemController.destroy);

export default router;
```

### `src/routes/index.ts`

```ts
import { Router } from "express";
import itemRoutes from "./item.routes";

const routes = Router();

routes.use("/items", itemRoutes);

export default routes;
```

## Arquivo Principal `src/index.ts`

```ts
import express from "express";
import "reflect-metadata";
import * as dotenv from "dotenv";
import { AppDataSource } from "./config/data-source";
import routes from "./routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(routes);

const port = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`API is running on http://localhost:${port}`);
    });
  })
  .catch((error) => console.log("Error during Data Source initialization", error));
```

## Scripts no `package.json`

```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/index.ts"
}
```

Execute com:

```bash
npm run dev
```

##  Testando a API

Você pode testar os endpoints com **Postman**, **Insomnia** ou `curl`.

- `GET    /items` → Lista todos os itens
- `GET    /items/:id` → Detalha um item
- `POST   /items` → Cria um novo item
- `PUT    /items/:id` → Atualiza um item
- `DELETE /items/:id` → Deleta um item
