// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { FormModule } from './form/form.module';
import { AuthModule } from './auth/auth.module';

import { ProtocolModule } from './protocol/protocol.module';
import { SubmissionModule } from './submission/submission.module';
import { GroupModule } from './group/group.module';
import { InstitutionModule } from './institution/institution.module';
import { GroupProtocolDeadlineModule } from './group-protocol-deadline/group-protocol-deadline.module';
import { PracticeModule } from './practice/practice.module';

import { GraphQLJSON } from 'graphql-type-json';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        uri: process.env.DB_URI,
      }),
      inject: [],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      resolvers: { JSON: GraphQLJSON },
      debug: true,
      playground: true,
      context: ({ req }) => ({ req }),
    }),
    FormModule,
    AuthModule,
    ProtocolModule,
    SubmissionModule,
    GroupModule,
    // InstitutionModule,
    GroupProtocolDeadlineModule,
    PracticeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
