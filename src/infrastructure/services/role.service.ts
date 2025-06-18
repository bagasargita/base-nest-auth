import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { IRoleRepository } from '../../core/domain/interfaces/role.repository.interface';
import { IPermissionRepository } from '../../core/domain/interfaces/permission.repository.interface';
import { Role } from '../../core/domain/entities/role.entity';
import { CreateRoleDto } from '../../core/application/dtos/role/create-role.dto';
import { UpdateRoleDto } from '../../core/application/dtos/role/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @Inject('IRoleRepository')
    private readonly roleRepository: IRoleRepository,
    @Inject('IPermissionRepository')
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }

  async findById(id: number): Promise<Role> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async findByName(name: string): Promise<Role> {
    const role = await this.roleRepository.findByName(name);
    if (!role) {
      throw new NotFoundException(`Role with name ${name} not found`);
    }
    return role;
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.roleRepository.findByName(createRoleDto.name);
    if (existingRole) {
      throw new ConflictException(`Role with name ${createRoleDto.name} already exists`);
    }

    // Create the role
    const role = await this.roleRepository.create({
      name: createRoleDto.name,
      description: createRoleDto.description,
    });

    // Create permissions for each menu
    if (createRoleDto.permissions?.length) {
      const menuIds = createRoleDto.permissions.map(p => p.menu_id);

      // Create permissions
      for (const permission of createRoleDto.permissions) {
        await this.permissionRepository.create({
          action: permission.action,
          menuId: permission.menu_id,
          roleId: role.id,
        });
      }
    }

    return this.findById(role.id);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findById(id);

    // Update role basic info
    const updatedRole = await this.roleRepository.update(id, {
      name: updateRoleDto.name,
      description: updateRoleDto.description,
      isActive: updateRoleDto.isActive,
    });

    if (!updatedRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Update permissions if provided
    if (updateRoleDto.permissions?.length) {
      // Delete existing permissions
      await this.permissionRepository.deleteByRoleId(id);

      const menuIds = updateRoleDto.permissions.map(p => p.menu_id);

      // Create new permissions
      for (const permission of updateRoleDto.permissions) {
        await this.permissionRepository.create({
          action: permission.action,
          menuId: permission.menu_id,
          roleId: id,
        });
      }
    }

    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.roleRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
  }
} 