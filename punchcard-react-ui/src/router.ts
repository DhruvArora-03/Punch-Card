// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/history`
  | `/home`
  | `/login`
  | `/payments`
  | `/settings`
  | `/users`
  | `/users/create`
  | `/users/view/:user_id`

export type Params = {
  '/users/view/:user_id': { user_id: string }
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
