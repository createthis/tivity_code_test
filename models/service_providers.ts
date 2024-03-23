import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import {DataType} from 'sequelize-typescript';

/*
 CREATE TABLE service_providers (
   provider_id SERIAL PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   reimbursement_cadence reimbursement_cadence NOT NULL
 );
*/

@Table({ tableName: 'service_providers' })
export default class ServiceProviders extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  provider_id?: number;

  @Column(DataType.STRING(255))
  name?: string;

  @Column(DataType.DATE)
  registration_date?: Date;
}
