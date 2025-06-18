import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IMenuRepository } from '../../core/domain/interfaces/menu.repository.interface';
import { Menu } from '../../core/domain/entities/menu.entity';
import { CreateMenuDto } from '../../core/application/dtos/menu/create-menu.dto';
import { UpdateMenuDto } from '../../core/application/dtos/menu/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @Inject('IMenuRepository')
    private readonly menuRepository: IMenuRepository,
  ) {}

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    const menu = new Menu();
    menu.name = createMenuDto.name;
    menu.path = createMenuDto.path;
    menu.icon = createMenuDto.icon ?? null;
    menu.order = createMenuDto.order ?? 0;

    if (createMenuDto.parentId) {
      const parent = await this.menuRepository.findById(createMenuDto.parentId);
      if (!parent) {
        throw new NotFoundException(`Parent menu with ID ${createMenuDto.parentId} not found`);
      }
      menu.parentId = parent.id;
    } else {
      menu.parentId = null;
    }

    return this.menuRepository.create(menu);
  }

  async findAll(): Promise<Menu[]> {
    return this.menuRepository.findAll();
  }

  async findOne(id: number): Promise<Menu> {
    const menu = await this.menuRepository.findById(id);
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return menu;
  }

  async update(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    const menu = await this.menuRepository.findById(id);
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    if (updateMenuDto.name) menu.name = updateMenuDto.name;
    if (updateMenuDto.path) menu.path = updateMenuDto.path;
    if (updateMenuDto.icon !== undefined) menu.icon = updateMenuDto.icon;
    if (updateMenuDto.order !== undefined) menu.order = updateMenuDto.order;

    if (updateMenuDto.parentId !== undefined) {
      if (updateMenuDto.parentId === null) {
        menu.parentId = null;
      } else {
        const parent = await this.menuRepository.findById(updateMenuDto.parentId);
        if (!parent) {
          throw new NotFoundException(`Parent menu with ID ${updateMenuDto.parentId} not found`);
        }
        menu.parentId = parent.id;
      }
    }

    return this.menuRepository.update(id, menu);
  }

  async remove(id: number): Promise<void> {
    const menu = await this.menuRepository.findById(id);
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    await this.menuRepository.delete(id);
  }
} 