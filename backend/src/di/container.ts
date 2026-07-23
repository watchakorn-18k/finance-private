import type { CacheRepository } from '../domain/repositories/cache-repository'
import type { UserRepository } from '../domain/repositories/user-repository'
import type { CategoryRepository } from '../domain/repositories/category-repository'
import type { TransactionRepository } from '../domain/repositories/transaction-repository'
import { UserHandler } from '../handlers/user-handler'
import { UserService } from '../services/user-service'
import { CategoryHandler } from '../handlers/category-handler'
import { CategoryService } from '../services/category-service'
import { TransactionHandler } from '../handlers/transaction-handler'
import { TransactionService } from '../services/transaction-service'

export interface Repositories {
  userRepository: UserRepository
  cacheRepository: CacheRepository
  categoryRepository: CategoryRepository
  transactionRepository: TransactionRepository
}

export interface Container {
  userHandler: UserHandler
  categoryHandler: CategoryHandler
  transactionHandler: TransactionHandler
}

export function createContainer(repos: Repositories): Container {
  const userService = new UserService(repos.userRepository, repos.cacheRepository)
  const categoryService = new CategoryService(repos.categoryRepository)
  const transactionService = new TransactionService(repos.transactionRepository, repos.categoryRepository)
  return {
    userHandler: new UserHandler(userService),
    categoryHandler: new CategoryHandler(categoryService),
    transactionHandler: new TransactionHandler(transactionService),
  }
}
