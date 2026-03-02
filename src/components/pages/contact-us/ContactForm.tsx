'use client'

import React from 'react'
import { Button, Input, Textarea } from '@heroui/react'
import { useFormik } from 'formik'
import { contactFormValidationSchema } from '@/utils/validation'
import { ChatBubbleLeftRightIconSVG, EmailIconSVG, ProfileIconSVG, SendIconSVG } from '@/components/library/AllSVG'
import { usePostContactUsMutation } from '@/redux/rtkQueries/allPostApi'
import { addToast } from '@heroui/react'

const initialValues = {
  name: '',
  email: '',
  message: '',
}

export default function ContactForm() {
  const [postContactUs, { isLoading }] = usePostContactUsMutation()

  const { values, errors, handleChange, handleBlur, handleSubmit, touched, resetForm } = useFormik({
    initialValues,
    validationSchema: contactFormValidationSchema,
    onSubmit: async (payload) => {
      try {
        await postContactUs({ name: payload.name, email: payload.email, message: payload.message }).unwrap()
        addToast({ title: 'Message sent successfully', color: 'success', timeout: 3000 })
        resetForm()
      } catch {
        addToast({ title: 'Failed to send message. Please try again.', color: 'danger', timeout: 3000 })
      }
    },
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-full min-w-0">
      <div className="min-w-0">
        <label className="mb-1.5 block text-sm font-medium text-fontBlack">
          Name
        </label>
        <Input
          name="name"
          type="text"
          placeholder="Name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          variant="bordered"
          startContent={<ProfileIconSVG />}
          isInvalid={!!(touched.name && errors.name)}
          errorMessage={touched.name && errors.name}
          classNames={{
            inputWrapper: 'account_input_design rounded-full! min-w-0',
          }}
        />
      </div>
      <div className="min-w-0">
        <label className="mb-1.5 block text-sm font-medium text-fontBlack">
          Email
        </label>
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          variant="bordered"
          startContent={<EmailIconSVG />}
          isInvalid={!!(touched.email && errors.email)}
          errorMessage={touched.email && errors.email}
          classNames={{
            inputWrapper: 'account_input_design rounded-full! min-w-0',
          }}
        />
      </div>
      <div className="min-w-0">
        <label className="mb-1.5 block text-sm font-medium text-fontBlack">
          Message
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 z-10 text-darkSilver pointer-events-none">
            <ChatBubbleLeftRightIconSVG />
          </span>
          <Textarea
            name="message"
            placeholder="What can we help you with?"
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            variant="bordered"
            minRows={4}
            isInvalid={!!(touched.message && errors.message)}
            errorMessage={touched.message && errors.message}
            classNames={{
              inputWrapper: 'account_input_design pl-10 min-w-0',
              input: 'text-fontBlack placeholder:text-placeHolderText',
            }}
          />
        </div>
      </div>
      <div className="flex justify-center pt-2">
        <Button
          type="submit"
          className="btn_radius btn_bg_blue w-full"
          endContent={<SendIconSVG />}
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          Send Message
        </Button>
      </div>
    </form>
  )
}
