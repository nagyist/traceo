import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Account } from "./account.entity";
import { AccountMemberRelationship } from "./account-member-relationship.entity";
import { Incident } from "./incident.entity";
import { GenericEntity } from "../../core/generic.entity";
import { Runtime } from "./runtime.entity";
import { InfluxDS } from "./influxds.entity";
import { IApplication } from "../../../lib/types/interfaces/application.interface";
import { TSDB } from "../../../lib/types/enums/tsdb.enum";

@Entity()
export class Application extends GenericEntity implements IApplication {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar' })
  privateKey: string;

  @Column({ type: 'varchar', nullable: true })
  dsn?: string;

  @ManyToOne(() => Account)
  @JoinColumn({
    name: 'ownerId',
  })
  owner: Account;

  @Column({ nullable: true, length: 256, type: 'varchar' })
  aboutDescription?: string;

  @Column({ nullable: true })
  gravatar?: string;

  @Column({ nullable: true })
  lastIncidentAt?: number;

  @Column({ nullable: false, default: false })
  isIntegrated: boolean;

  @OneToMany(
    () => AccountMemberRelationship,
    (accountApp) => accountApp.application,
    {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  )
  members?: AccountMemberRelationship[];
  membersCount?: number;

  @OneToMany(() => Incident, (incident) => incident.application, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  incidents?: Incident[];


  @Column({
    type: "bigint",
    nullable: false,
    name: "incidentscount",
    default: 0
  })
  incidentsCount?: number = 0;

  @Column({
    type: "bigint",
    nullable: false,
    name: "errorscount",
    default: 0
  })
  errorsCount?: number = 0;

  @OneToMany(() => Runtime, (runtime) => runtime.application, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  runtimeData?: Runtime[];

  @ManyToOne(() => InfluxDS)
  @JoinColumn({
    name: 'influxId',
  })
  influxDS?: InfluxDS;

  @Column({
    type: "varchar",
    nullable: true
  })
  connectedTSDB?: TSDB;
}
