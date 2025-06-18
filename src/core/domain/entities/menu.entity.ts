import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Permission } from './permission.entity';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column({ nullable: true, type: 'varchar' })
  icon: string | null;

  @Column({ name: 'parent_id', nullable: true, type: 'int' })
  parentId: number | null;

  @ManyToOne(() => Menu, menu => menu.children, { nullable: true })
  parent: Menu | null;

  @OneToMany(() => Menu, menu => menu.parent)
  children: Menu[];

  @Column({ default: 0 })
  order: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Permission, permission => permission.menu)
  permissions: Permission[];
}
