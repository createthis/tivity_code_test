import { Table, Column, Model, DataType, BelongsTo, HasMany, ForeignKey } from 'sequelize-typescript';
import ServiceProviders from './service_providers';
import Activities from './activities';

/*
CREATE TYPE reimbursement_status AS ENUM ('pending', 'processed');
CREATE TABLE reimbursements (
    reimbursement_id SERIAL PRIMARY KEY,
    service_provider_id INT NOT NULL,
    cycle_start_date TIMESTAMP NOT NULL,
    cycle_end_date TIMESTAMP NOT NULL,
    total_activity_value DECIMAL(10, 2) NOT NULL,
    reimbursed_amount DECIMAL(10, 2) NOT NULL,
    status reimbursement_status NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (service_provider_id) REFERENCES service_providers(service_provider_id)
);
*/

@Table({ tableName: 'reimbursements', underscored: true, updatedAt: false })
export default class Reimbursements extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  reimbursement_id?: number;

  @ForeignKey(() => ServiceProviders)
  @Column(DataType.INTEGER())
  service_provider_id?: number;

  @BelongsTo(() => ServiceProviders, { constraints: false })
  service_provider?: ServiceProviders;

  @Column(DataType.DATE)
  cycle_start_date?: Date;

  @Column(DataType.DATE)
  cycle_end_date?: Date;

  @Column(DataType.DECIMAL(10,2))
  total_activity_value?: number;

  @Column(DataType.DECIMAL(10,2))
  reimbursed_amount?: number;

  @Column(DataType.ENUM('pending', 'processed'))
  status?: string;

  @Column(DataType.DATE)
  created_at?: Date;

  @Column(DataType.DATE)
  processed_at?: Date;

  @HasMany(() => Activities, { constraints: false })
  activities?: Activities[];
}
