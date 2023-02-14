import { DataSource } from "typeorm";

export const databaseProviders = [
  {
    provide: "DATA_SOURCE",
    useFactory: async () => {
      const dataSource = new DataSource({
        type: "mysql",
        host: "localhost",
        port: 3308,
        username: "root",
        password: "1234",
        database: "dev",
        entities: [__dirname + "/../**/*.entity{.ts,.js}"],
        synchronize: true
      });
      // const dataSource = new DataSource({
      //   type: "postgres",
      //   host: "localhost",
      //   port: 5432,
      //   username: "postgres",
      //   password: "1234",
      //   database: "postgres",
      //   entities: [__dirname + "/../**/*.entity{.ts,.js}"],
      //   synchronize: true,
      //   url: "test"
      // });

      return dataSource.initialize();
    }
  }
];
