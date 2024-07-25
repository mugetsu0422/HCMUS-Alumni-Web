'use client'
import React, { createContext, useContext, useRef, useState } from 'react'
import Link from 'next/link'
import { Input, Button, Typography } from '@material-tailwind/react'
import { roboto } from '../../ui/fonts'
import { useForm } from 'react-hook-form'
import ErrorInput from '../../ui/error-input'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import {
  EMAIL_ACTIVATION_CODE_TIMER,
  JWT_COOKIE,
  JWT_EXPIRED_TIME,
} from '../../constant'
import Countdown from 'react-countdown'
import toast, { Toaster } from 'react-hot-toast'

const FormContext = createContext(null)

function Step1() {
  const { inputs, setInputs, handleNext } = useContext(FormContext)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useForm()

  const onSubmit = async (data) => {
    setInputs({
      email: data.email,
    })

    axios
      .postForm(`${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/forgot-password`, {
        email: data.email,
      })
      .then((res) => {
        handleNext()
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
        return
      })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="mb-4 flex flex-col gap-3">
          <Typography
            placeholder={undefined}
            variant="h6"
            color="blue-gray"
            className={`${roboto}`}>
            Email <span className="text-red-700 font-bold text-lg">*</span>
          </Typography>
          <Input
            size="lg"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 w-96"
            {...register('email', {
              required: 'Vui lòng nhập email',
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: 'Hãy nhập đúng định dạng email. Ví dụ: test@gmail.com',
              },
            })}
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            crossOrigin={undefined}
          />
          <ErrorInput
            // This is the error message
            errors={errors?.email?.message}
          />
        </div>
      </div>
      <Button
        type="submit"
        placeholder={undefined}
        ripple={true}
        className={` mt-[3rem] w-full bg-blue-800 text-white rounded-md py-4`}>
        Tiếp tục
      </Button>
    </form>
  )
}

function Step2() {
  const { inputs, setInputs, handleBack } = useContext(FormContext)
  const [isCodeExpired, setIsCodeExpired] = useState(false)
  const router = useRouter()
  const timer = useRef(Date.now())

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useForm()

  const onSubmit = (data) => {
    // Verify email activation code
    axios
      .postForm(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/verify-reset-code`,
        {
          email: inputs.email,
          resetCode: data.resetCode,
          newPassword: data.newPassword,
        }
      )
      .then(() => {
        // Back to signin page
        toast.success('Đổi mật khẩu thành công')
        router.push('/signin')
      })
      .catch((error) => {
        // failed
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
      })
  }

  const resendCode = () => {
    // Send email activation code
    axios
      .postForm(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/send-authorize-code`,
        { email: inputs.email }
      )
      .then((res) => {})
      .catch((error) => {
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
      })
    setIsCodeExpired(false)
    timer.current = Date.now()
  }

  const countdownRenderer = ({ seconds }) => {
    return (
      <span className="text-red-500 font-semibold m-auto h-auto absolute right-4 top-1/2 -translate-y-1/2">
        {seconds}s
      </span>
    )
  }
  return (
    <form
      //summit form
      onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-1 flex flex-col gap-6">
        <Typography
          placeholder={undefined}
          variant="h6"
          color="blue-gray"
          className={` -mb-3`}>
          Email
        </Typography>

        <div className="flex relative w-full max-w-[24rem]">
          <Input
            size="lg"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pr-20"
            value={inputs.email}
            disabled
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            containerProps={{
              className: 'min-w-0',
            }}
            crossOrigin={undefined}
          />
        </div>
      </div>

      <div className="mb-1 flex flex-col gap-6">
        <Typography
          placeholder={undefined}
          variant="h6"
          color="blue-gray"
          className={` -mb-3`}>
          Mã xác thực <span className="text-red-700 font-bold text-lg">*</span>
        </Typography>

        <div className="flex relative w-full max-w-[24rem]">
          <Input
            size="lg"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pr-20"
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            {...register('resetCode', {
              required: 'Vui lòng nhập mã xác thực',
            })}
            containerProps={{
              className: 'min-w-0',
            }}
            crossOrigin={undefined}
          />

          {isCodeExpired ? (
            <Button
              placeholder={undefined}
              size="sm"
              color="blue"
              variant="text"
              className="!absolute right-1 top-1.5 rounded"
              onClick={resendCode}>
              Gửi lại
            </Button>
          ) : (
            <Countdown
              key={timer.current}
              date={timer.current + EMAIL_ACTIVATION_CODE_TIMER}
              renderer={countdownRenderer}
              onComplete={() => setIsCodeExpired(true)}
            />
          )}
        </div>
        <ErrorInput
          // This is the error message
          errors={errors?.resetCode?.message}
        />
      </div>

      <div className="mb-1 flex flex-col gap-6">
        <Typography
          placeholder={undefined}
          variant="h6"
          color="blue-gray"
          className={` -mb-3`}>
          Mật khẩu mới <span className="text-red-700 font-bold text-lg">*</span>
        </Typography>

        <div className="flex relative w-full max-w-[24rem]">
          <Input
            size="lg"
            type="password"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pr-20"
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            {...register('newPassword', {
              required: 'Vui lòng nhập mật khẩu mới',
            })}
            containerProps={{
              className: 'min-w-0',
            }}
            crossOrigin={undefined}
          />
        </div>
        <ErrorInput
          // This is the error message
          errors={errors?.newPassword?.message}
        />
      </div>

      <Button
        type="submit"
        placeholder={undefined}
        ripple={true}
        className={`mt-[3rem] w-full bg-blue-800 text-white rounded-md py-4`}>
        Đổi mật khẩu
      </Button>

      <Button
        onClick={handleBack}
        placeholder={undefined}
        ripple={true}
        className={`mt-[1rem] w-full bg-blue-800 text-white rounded-md py-4`}>
        Trở lại
      </Button>
    </form>
  )
}

function ForgotPasswordForm() {
  const { currentStep } = useContext(FormContext)

  return (
    <div className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
      {currentStep == 1 && (
        <>
          <Step1 />
        </>
      )}
      {currentStep == 2 && (
        <>
          <Step2 />
        </>
      )}
    </div>
  )
}

export default function Page() {
  const [inputs, setInputs] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)

  const handleNext = () => {
    setCurrentStep(currentStep + 1)
  }
  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  return (
    <div
      className={`${roboto.className} w-auto h-auto m-auto xl:m-0 xl:ml-[5rem] sm:pt-[10rem] 2xl:pt-0`}>
      <Typography
        variant="h2"
        color="blue-gray"
        placeholder={undefined}
        className="my-8">
        QUÊN MẬT KHẨU
      </Typography>
      <FormContext.Provider
        value={{
          inputs: inputs,
          setInputs: setInputs,
          currentStep: currentStep,
          handleBack: handleBack,
          handleNext: handleNext,
        }}>
        <ForgotPasswordForm />
      </FormContext.Provider>
      <Link href="/signin" className="w-full">
        <Button
          placeholder={undefined}
          size="lg"
          className={`font-bold bg-[#e4e6eb] text-[#4b4f56] w-full`}
          ripple={true}>
          Hủy
        </Button>
      </Link>
    </div>
  )
}
