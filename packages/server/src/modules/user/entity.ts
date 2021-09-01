/* eslint-disable import/no-cycle */
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne
} from 'typeorm';
import { ObjectType, Field } from 'type-graphql';

import BaseEntity from '@db/baseEntity';
import Activity from '@modules/activity/entity';
import Category from '@modules/category/entity';
import Task from '@modules/task/entity';
import Stage from '@modules/stage/entity';
import Organization from '@modules/organization/entity';
import Project from '@modules/project/entity';
import Lock from '@modules/lock/entity';
import Settings from '@modules/settings/entity';
import Token from '@modules/auth/entity';
import { AccountStatus } from '@shared/enums';

@ObjectType()
@Entity()
export default class User extends BaseEntity {
  @Field({ nullable: true })
  @Column({ nullable: true, type: 'timestamptz' })
  activeAt!: Date;

  @Field({ nullable: true })
  @Column({ length: 256, nullable: true, type: 'varchar' })
  avatarUrl!: string;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'timestamptz' })
  deletedAt!: Date;

  @Field()
  @Column({ length: 128, nullable: false, type: 'varchar', unique: true })
  email!: string;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true, type: 'varchar' })
  name!: string;

  @Column({ length: 128, nullable: true, type: 'varchar' })
  password!: string;

  @Column({ length: 50, nullable: true, type: 'varchar' })
  provider!: string;

  @Column({ default: 0, nullable: false, type: 'integer' })
  tokenVersion!: number;

  @Field(() => AccountStatus)
  @Column({
    default: AccountStatus.Active,
    enum: AccountStatus,
    nullable: false,
    type: 'enum'
  })
  status!: AccountStatus;

  @Field(() => Settings, { nullable: true })
  @OneToOne(() => Settings, {
    nullable: true
  })
  @JoinColumn()
  settings!: Settings;

  @Field(() => Category)
  @OneToMany(() => Category, category => category.creator)
  categoryCreator!: Category[];

  @Field(() => Category)
  @OneToMany(() => Category, category => category.modifier)
  categoryModifier!: Category[];

  @Field(() => Task)
  @OneToMany(() => Task, task => task.creator)
  taskModifier!: Task[];

  @Field(() => Task)
  @OneToMany(() => Task, task => task.modifier)
  taskCreator!: Task[];

  @Field(() => Task)
  @OneToMany(() => Task, task => task.performer)
  taskPerformer!: Task[];

  @Field(() => Organization)
  @OneToMany(() => Organization, organization => organization.creator)
  orgCreator!: Organization[];

  @Field(() => Organization)
  @OneToMany(() => Organization, organization => organization.modifier)
  orgModifier!: Organization[];

  @Field(() => Stage)
  @OneToMany(() => Stage, stage => stage.creator)
  stageCreator!: Stage[];

  @Field(() => Stage)
  @OneToMany(() => Stage, stage => stage.modifier)
  stageModifier!: Stage[];

  @Field(() => Project)
  @OneToMany(() => Project, project => project.creator)
  projectCreator!: Project[];

  @Field(() => Project)
  @OneToMany(() => Project, project => project.modifier)
  projectModifier!: Project[];

  @Field(() => Lock)
  @OneToMany(() => Lock, lock => lock.user)
  locks!: Lock[];

  @Field(() => Activity)
  @OneToMany(() => Activity, activity => activity.user)
  change!: Activity[];

  @Field(() => Activity)
  @OneToMany(() => Activity, activity => activity.performer)
  activity!: Activity[];

  @Field(() => Token)
  @OneToMany(() => Token, token => token.user)
  token!: Token[];

  @Field(() => Project)
  @ManyToMany(() => Project, project => project.isFavorite)
  @JoinTable()
  favorites!: Project[];

  @Field(() => Project)
  @ManyToMany(() => Project, project => project.owners)
  @JoinTable()
  projectOwner!: Project[];

  @Field(() => Project)
  @ManyToMany(() => Project, project => project.admins)
  @JoinTable()
  projectAdmin!: Project[];

  @Field(() => Project)
  @ManyToMany(() => Project, project => project.members)
  @JoinTable()
  projectMember!: Project[];

  @Field(() => Project)
  @ManyToMany(() => Project, project => project.viewers)
  @JoinTable()
  projectViewer!: Project[];

  @Field(() => Organization)
  @ManyToMany(() => Organization, organization => organization.owners)
  @JoinTable()
  organizationOwner!: Organization[];

  @Field(() => Organization)
  @ManyToMany(() => Organization, organization => organization.admins)
  @JoinTable()
  organizationAdmin!: Organization[];

  @Field(() => Organization)
  @ManyToMany(() => Organization, organization => organization.members)
  @JoinTable()
  organizationMember!: Organization[];

  @Field(() => Organization)
  @ManyToMany(() => Organization, organization => organization.viewers)
  @JoinTable()
  organizationViewer!: Organization[];
}
