import { Pagination } from './model.interface.js'

export interface IBaseError {
  statusCode: number
  message: string | any[]
  type: string
  data?: Record<string, any> | string
  timestamp: string
  path: string
  errors?: any[]
}

export interface IExceptionResponse {
  statusCode: number
  message: string | string[] | object
  error: string
}

export interface IResponse {
  statusCode: number
  message: string
  data: any
  timestamp: string
  path?: string
  resource?: string
}

export interface FetchQuery extends Pagination, FilterDateRange {
  search?: string
}

export interface FilterDateRange {
  startDate?: Date | string | number
  endDate?: Date | string | number
}
