import { NotFoundException } from '@nestjs/common';

export const findByIdOrThrow = async <TDocument>(
  operation: Promise<TDocument | null>,
  id: string,
  entityName: string,
): Promise<TDocument> => {
  const item = await operation;

  if (!item) {
    throw new NotFoundException(`${entityName} with id ${id} not found`);
  }

  return item;
};

export const updateByIdOrThrow = async <TDocument, TUpdate>(
  operation: Promise<TDocument | null>,
  id: string,
  _update: TUpdate,
  entityName: string,
): Promise<TDocument> => {
  const item = await operation;

  if (!item) {
    throw new NotFoundException(`${entityName} with id ${id} not found`);
  }

  return item;
};

export const deleteByIdOrThrow = async <TDocument>(
  operation: Promise<TDocument | null>,
  id: string,
  entityName: string,
): Promise<TDocument> => {
  const item = await operation;

  if (!item) {
    throw new NotFoundException(`${entityName} with id ${id} not found`);
  }

  return item;
};
