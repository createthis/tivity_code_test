import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Members from './members';
import Reimbursements from './reimbursements';

/*
CREATE TYPE activity_type AS ENUM ('activity', 'adjustment');
CREATE TABLE activities (
    activity_id SERIAL PRIMARY KEY,
    member_id INT NOT NULL,
    reimbursement_id INT,
    activity_date TIMESTAMP NOT NULL,
    description TEXT,
    activity_type activity_type NOT NULL,
    parent_activity_id INT DEFAULT NULL,
    value DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(member_id)
);
*/

@Table({ tableName: 'activities', underscored: true, updatedAt: false })
export default class Activities extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  activity_id?: number;

  @ForeignKey(() => Members)
  @Column(DataType.INTEGER())
  member_id?: number;

  @BelongsTo(() => Members, { constraints: false })
  member?: Members;

  @ForeignKey(() => Reimbursements)
  @Column(DataType.INTEGER())
  reimbursement_id?: number;

  @BelongsTo(() => Reimbursements, { constraints: false })
  reimbursement?: Reimbursements;

  @Column(DataType.INTEGER())
  parent_activity_id?: number;

  @Column(DataType.TEXT)
  description?: string;

  @Column(DataType.DECIMAL(10,2))
  value?: number;

  @Column(DataType.ENUM('activity', 'adjustment'))
  activity_type?: string;

  @Column(DataType.DATE)
  activity_date?: Date;

  @Column(DataType.DATE)
  created_at?: Date;
}
