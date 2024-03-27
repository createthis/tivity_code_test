import { Table, Column, Model } from 'sequelize-typescript';
import { DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import ServiceProviders from './service_providers';

/*
CREATE TYPE member_status AS ENUM ('active', 'removed');
CREATE TABLE members (
    member_id SERIAL PRIMARY KEY,
    service_provider_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    status member_status NOT NULL,
    registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    removed_at TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (service_provider_id) REFERENCES service_providers(service_provider_id)
);
*/

@Table({ tableName: 'members' })
export default class Members extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  member_id?: number;

  @ForeignKey(() => ServiceProviders)
  @Column(DataType.INTEGER())
  service_provider_id?: number;

  @BelongsTo(() => ServiceProviders, { constraints: false })
  service_provider?: ServiceProviders;

  @Column(DataType.STRING(255))
  name?: string;

  @Column(DataType.ENUM('active', 'removed'))
  status?: string;

  @Column(DataType.DATE)
  registration_date?: Date;

  @Column(DataType.DATE)
  created_at?: Date;

  @Column(DataType.DATE)
  removed_at?: Date;
}
