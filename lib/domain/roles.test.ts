// lib/domain/roles.test.ts — companheiro obrigatorio (domain-logic rule).

import { describe, expect, it } from 'vitest'

import { HUMAN_ROLES, isHumanRole, isRole, ROLES, RoleSchema } from './roles'

describe('roles', () => {
  describe('ROLES', () => {
    it('contem exatamente as 5 roles canonicas', () => {
      expect(ROLES).toEqual([
        'platform_admin',
        'professional',
        'client',
        'influencer',
        'service_account',
      ])
    })
  })

  describe('RoleSchema', () => {
    it('aceita roles validas', () => {
      for (const role of ROLES) {
        expect(RoleSchema.safeParse(role).success).toBe(true)
      }
    })

    it('rejeita vocab banido', () => {
      expect(RoleSchema.safeParse('student').success).toBe(false)
      expect(RoleSchema.safeParse('trainer').success).toBe(false)
      expect(RoleSchema.safeParse('super-admin').success).toBe(false)
      expect(RoleSchema.safeParse('').success).toBe(false)
    })
  })

  describe('isRole', () => {
    it('narrowing funciona pra strings validas', () => {
      expect(isRole('professional')).toBe(true)
      expect(isRole('platform_admin')).toBe(true)
    })

    it('rejeita unknown / wrong type', () => {
      expect(isRole(123)).toBe(false)
      expect(isRole(undefined)).toBe(false)
      expect(isRole({ role: 'professional' })).toBe(false)
      expect(isRole('admin')).toBe(false)
    })
  })

  describe('isHumanRole', () => {
    it('classifica humanos vs system', () => {
      expect(isHumanRole('professional')).toBe(true)
      expect(isHumanRole('client')).toBe(true)
      expect(isHumanRole('platform_admin')).toBe(true)
      expect(isHumanRole('influencer')).toBe(true)
      expect(isHumanRole('service_account')).toBe(false)
    })

    it('HUMAN_ROLES tem 4 elementos (exclui service_account)', () => {
      expect(HUMAN_ROLES).toHaveLength(4)
      expect(HUMAN_ROLES).not.toContain('service_account')
    })
  })
})
