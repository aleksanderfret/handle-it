/* eslint-disable import/no-cycle */
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { ObjectType, Field } from 'type-graphql';

import BaseEntity from '@db/baseEntity';
import Activity from '@modules/activity/entity';
import Task from '@modules/task/entity';
import Lock from '@modules/lock/entity';
import User from '@modules/user/entity';
import { Status, Type } from '@shared/enums';

@ObjectType()
@Entity()
export default class Project extends BaseEntity {
  @Field()
  @Column({ length: 1000, nullable: true, type: 'varchar' })
  description!: string;

  @Field()
  @Column({ length: 50, nullable: false, type: 'varchar' })
  name!: string;

  @Field(() => Type)
  @Column({
    default: Type.BASIC,
    enum: Type,
    nullable: false,
    type: 'enum'
  })
  type!: Type;

  @Field(() => Status)
  @Column({
    default: Status.ACTIVE,
    enum: Status,
    nullable: false,
    type: 'enum'
  })
  status!: Status;

  @Field(() => User)
  @ManyToMany(() => User, user => user.favorites)
  isFavorite!: User[];

  @Field(() => Task)
  @OneToMany(() => Task, task => task.project)
  tasks!: Task[];

  @Field(() => Activity)
  @OneToMany(() => Activity, activity => activity.project)
  change!: Activity[];

  @Field(() => Lock)
  @OneToMany(() => Lock, lock => lock.project)
  locks!: Lock[];

  @Field(() => User)
  @ManyToOne(() => User, user => user.projectCreator, { nullable: false })
  creator!: User;

  @Field(() => User)
  @ManyToOne(() => User, user => user.projectModifier, { nullable: false })
  modifier!: User;

  @Field(() => Project)
  @ManyToMany(() => Project, project => project.complexProjects)
  @JoinTable()
  projects!: Project[];

  @Field(() => Project)
  @ManyToMany(() => Project, project => project.projects)
  complexProjects!: Project[];

  @Field(() => User)
  @ManyToMany(() => User, user => user.owner)
  owners!: User[];

  @Field(() => User)
  @ManyToMany(() => User, user => user.member)
  members!: User[];

  @Field(() => User)
  @ManyToMany(() => User, user => user.viewer)
  viewers!: User[];
}
