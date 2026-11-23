'use client'
import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { CheckCircle2, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Turnstile } from '@/components/Turnstile'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { fields } from './fields'
import { FormSidebar } from './Sidebar'
import { getClientSideURL } from '@/utilities/getURL'

export type FormBlockType = {
  anchorId?: string | null
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: DefaultTypedEditorState
  sidebar?: {
    noteLinkLabel?: string | null
    noteLinkUrl?: string | null
    noteText?: string | null
    noteTitle?: string | null
    showGamblingHelp?: boolean | null
    showSocial?: boolean | null
    supportEmail?: string | null
    supportNote?: string | null
    supportTitle?: string | null
  } | null
}

export const FormBlockClient: React.FC<
  {
    helplineNumber?: string | null
    id?: string
    socialLinks?: { id?: string | null; platform: string; url: string }[]
  } & FormBlockType
> = (props) => {
  const {
    anchorId,
    enableIntro,
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    helplineNumber,
    introContent,
    sidebar,
    socialLinks,
  } = props

  const formMethods = useForm({
    defaultValues: formFromProps.fields,
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const [captchaToken, setCaptchaToken] = useState<null | string>(null)
  const [captchaReset, setCaptchaReset] = useState(0)
  const router = useRouter()

  const onSubmit = useCallback(
    (data: FormFieldBlock[]) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        if (!captchaToken) {
          setError({ message: 'Please wait a moment for the security check to finish, then try again.' })
          return
        }

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
              'x-captcha-token': captchaToken,
            },
            method: 'POST',
          })

          const res = await req.json()
          setCaptchaReset((n) => n + 1)

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setCaptchaReset((n) => n + 1)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType, captchaToken],
  )

  const hasSidebar = Boolean(sidebar && (sidebar.noteTitle || sidebar.noteText || sidebar.supportEmail || sidebar.showSocial || sidebar.showGamblingHelp))

  return (
    <section className="section-wrap" id={anchorId || undefined}>
      <div className={`section-container form-container${hasSidebar ? ' has-sidebar' : ''}`}>
        <div className="form-card">
          {hasSubmitted && confirmationType === 'message' ? (
            <div className="form-success">
              <span className="form-success-icon">
                <CheckCircle2 aria-hidden="true" />
              </span>
              <RichText data={confirmationMessage} enableGutter={false} enableProse={false} />
            </div>
          ) : (
            <>
              {enableIntro && introContent && (
                <div className="form-intro">
                  <RichText data={introContent} enableGutter={false} enableProse={false} />
                </div>
              )}
              {error && <p className="form-error">{error.message || 'Something went wrong.'}</p>}
              <FormProvider {...formMethods}>
                <form id={formID} onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-grid">
                    {formFromProps &&
                      formFromProps.fields &&
                      formFromProps.fields?.map((field, index) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                        if (Field) {
                          return (
                            <Field
                              form={formFromProps}
                              key={index}
                              {...field}
                              {...formMethods}
                              control={control}
                              errors={errors}
                              register={register}
                              setValue={setValue}
                            />
                          )
                        }
                        return null
                      })}
                  </div>

                  <Turnstile onToken={setCaptchaToken} resetSignal={captchaReset} />

                  <div className="form-submit-row">
                    <p className="form-submit-note">
                      <ShieldCheck aria-hidden="true" className="form-submit-note-icon" />
                      We only use your details to reply to this message.
                    </p>
                    <button className="btn-primary form-submit" disabled={isLoading} form={formID} type="submit">
                      {isLoading ? 'Sending…' : submitButtonLabel}
                    </button>
                  </div>
                </form>
              </FormProvider>
            </>
          )}
        </div>
        {hasSidebar && sidebar && (
          <FormSidebar helplineNumber={helplineNumber} sidebar={sidebar} socialLinks={socialLinks || []} />
        )}
      </div>
    </section>
  )
}
