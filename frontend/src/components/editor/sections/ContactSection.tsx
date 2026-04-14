import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { SectionWrapper } from '../SectionWrapper'
import { Input } from '../../ui/Input'
import { useAutoSave } from '../../../hooks/useAutoSave'
import { parseContent } from '../../../lib/parseContent'
import type { ResumeSection, ContactContent } from '../../../types/resume'

interface Props { section: ResumeSection }

export function ContactSection({ section }: Props) {
  const parsed = parseContent<ContactContent>(section.content) ?? {}
  const { register, watch, reset } = useForm<ContactContent>({ defaultValues: parsed })
  const values = watch()

  useEffect(() => {
    reset(parseContent<ContactContent>(section.content) ?? {})
  }, [section.id, section.content])

  useAutoSave(section.id, values)

  return (
    <SectionWrapper sectionId={section.id} sectionType="contact" title="Contact" currentContent={values} showAI={false}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Full Name" {...register('full_name')} />
        <Input label="Email" type="email" {...register('email')} />
        <Input label="Phone" type="tel" {...register('phone')} />
        <Input label="Location" placeholder="City, State" {...register('location')} />
        <Input label="LinkedIn URL" {...register('linkedin')} />
        <Input label="GitHub URL" {...register('github')} />
      </div>
    </SectionWrapper>
  )
}
