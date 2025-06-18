import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../../core/domain/entities/permission.entity';
import { IPermissionRepository } from '../../core/domain/interfaces/permission.repository.interface';

@Injectable()
export class PermissionRepository implements IPermissionRepository {
  constructor(
    @InjectRepository(Permission)
    private readonly repository: Repository<Permission>,
  ) {}

  async findAll(): Promise<Permission[]> {
    return this.repository.find({ relations: ['menu', 'role'] });
  }

  async findById(id: number): Promise<Permission | null> {
    return this.repository.findOne({ where: { id }, relations: ['menu', 'role'] });
  }

  async findByRoleId(roleId: number): Promise<Permission[]> {
    return this.repository.find({ where: { roleId }, relations: ['menu', 'role'] });
  }

  async findByMenuId(menuId: number): Promise<Permission[]> {
    return this.repository.find({ where: { menuId }, relations: ['menu', 'role'] });
  }

  async create(permission: Partial<Permission>): Promise<Permission> {
    const newPermission = this.repository.create(permission);
    return this.repository.save(newPermission);
  }

  async update(id: number, permission: Partial<Permission>): Promise<Permission | null> {
    await this.repository.update(id, permission);
    return this.findById(id);
  }

  async delete(id: number): Promise<any> {
    const result = await this.repository.delete(id);
    return result;
  }

  async deleteByRoleId(roleId: number): Promise<any> {
    const result = await this.repository.delete({ roleId });
    return result;
  }
} 