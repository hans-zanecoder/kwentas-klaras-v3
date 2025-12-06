<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              :class="[
                'px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider',
                getColumnAlign(column.align)
              ]"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(row, index) in data"
            :key="getRowKey(row, index)"
            class="hover:bg-gray-50 transition"
          >
            <slot name="row" :row="row" :index="index">
              <td
                v-for="column in columns"
                :key="column.key"
                :class="[
                  'px-6 py-4 whitespace-nowrap',
                  getColumnAlign(column.align)
                ]"
              >
                <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                  {{ row[column.key] }}
                </slot>
              </td>
            </slot>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!hasData" class="text-center py-12">
      <slot name="empty">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">{{ emptyMessage }}</h3>
        <p class="mt-1 text-sm text-gray-500">{{ emptyDescription }}</p>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TableProps } from '~/types/ui/table'
import { useTable } from '~/composables/ui/useTable'

const props = withDefaults(defineProps<TableProps>(), {
  keyField: 'id',
  emptyMessage: 'No data found',
  emptyDescription: 'Try adjusting your search criteria.',
})

const { hasData, getColumnAlign } = useTable(props)

const getRowKey = (row: any, index: number) => {
  return row[props.keyField] || index
}
</script>
