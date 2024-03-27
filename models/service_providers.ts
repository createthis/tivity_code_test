import { Table, Column, Model } from 'sequelize-typescript';
import { DataType, HasMany } from 'sequelize-typescript';
import Members from './members';

/*
CREATE TYPE reimbursement_cadence AS ENUM ('daily', 'weekly', 'monthly', 'yearly');
CREATE TABLE service_providers (
    service_provider_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    reimbursement_cadence reimbursement_cadence NOT NULL,
    reimbursement_percentage DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
*/

@Table({ tableName: 'service_providers' })
export default class ServiceProviders extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  service_provider_id?: number;

  @Column(DataType.STRING(255))
  name?: string;

  @Column(DataType.ENUM('daily', 'weekly', 'monthly', 'yearly'))
  reimbursement_cadence?: string;

  @Column(DataType.DECIMAL(10,2))
  reimbursement_percentage?: number;

  @Column(DataType.DATE)
  created_at?: Date;

  @HasMany(() => Members, { constraints: false })
  members?: Members[];
}
