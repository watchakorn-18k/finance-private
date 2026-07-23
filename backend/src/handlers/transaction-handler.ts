import type { Context } from 'hono'
import type { TransactionService } from '../services/transaction-service'
import { getUserId, getParam, parseJson } from '../utils/request-utils'
import { createTransactionSchema, updateTransactionSchema, transactionQuerySchema } from '../schemas/transaction-schemas'
import { NotFoundError } from '../domain/errors'

export class TransactionHandler {
  constructor(private readonly transactionService: TransactionService) {}

  list = async (c: Context) => {
    const userId = await getUserId(c)
    const query = transactionQuerySchema.parse(c.req.query())
    const { items, total } = await this.transactionService.listTransactions(userId, query)
    return c.json({ data: items, meta: { total, limit: query.limit ?? 50, offset: query.offset ?? 0 } })
  }

  create = async (c: Context) => {
    const userId = await getUserId(c)
    const body = await parseJson(c)
    const input = createTransactionSchema.parse(body)
    const transaction = await this.transactionService.createTransaction(userId, input)
    return c.json({ data: transaction }, 201)
  }

  update = async (c: Context) => {
    const userId = await getUserId(c)
    const id = getParam(c, 'id')
    const body = await parseJson(c)
    const input = updateTransactionSchema.parse(body)
    const transaction = await this.transactionService.updateTransaction(id, userId, input)
    return c.json({ data: transaction })
  }

  delete = async (c: Context) => {
    const userId = await getUserId(c)
    const id = getParam(c, 'id')
    await this.transactionService.deleteTransaction(id, userId)
    return c.body(null, 204)
  }
}
