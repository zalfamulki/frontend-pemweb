'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestPage() {

  useEffect(() => {

    async function testDB() {

      const { data, error } = await supabase
        .from('users')
        .select('*')

      console.log('DATA:', data)
      console.log('ERROR:', error)

    }

    testDB()

  }, [])

  return (
    <div>
      Test Supabase
    </div>
  )
}