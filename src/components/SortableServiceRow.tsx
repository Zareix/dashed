import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import DeleteServiceButton from '~/components/DeleteServiceButton'
import EditServiceButton from '~/components/EditServiceButton'
import { TableCell, TableRow } from '~/components/ui/table'
import { cn, isAuthorizedDomain } from '~/lib/utils'
import type { Service } from '~/server/db/schema'

function SortableServiceRow({
  item,
  loading = false,
}: {
  item?: Pick<Service, 'id' | 'name' | 'url' | 'icon' | 'categoryName'>
  loading?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item?.id ?? '' })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (!item) {
    return null
  }

  return (
    <TableRow
      ref={setNodeRef}
      style={loading ? {} : style}
      {...attributes}
      className={cn(loading && 'opacity-50')}
    >
      <TableCell>
        <span className="cursor-move" {...listeners}>
          <GripVertical className="h-5 w-5 text-gray-500" />
        </span>
      </TableCell>
      <TableCell>
        {isAuthorizedDomain(item.icon) ? (
          <Image
            src={item.icon}
            alt={`${item.name} icon`}
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
        ) : (
          <img
            src={item.icon}
            alt={`${item.name} icon`}
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
        )}
      </TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.url}</TableCell>
      <TableCell>
        <EditServiceButton disabled={loading} service={item} />
        <DeleteServiceButton service={item} />
      </TableCell>
    </TableRow>
  )
}

export default SortableServiceRow
