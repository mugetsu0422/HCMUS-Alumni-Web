'use client'
import React, { createContext, useContext, useRef, useState } from 'react'
import Link from 'next/link'
import { Input, Button, Typography } from '@material-tailwind/react'
import { roboto } from '../../ui/fonts'
import { useForm } from 'react-hook-form'
import ErrorInput from '../../ui/error-input'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import bcrypt from 'bcryptjs'
import {
  EMAIL_ACTIVATION_CODE_TIMER,
  JWT_COOKIE,
  JWT_EXPIRED_TIME,
  SALT,
} from '../../constant'
import Countdown from 'react-countdown'
import toast, { Toaster } from 'react-hot-toast'
import Cookies from 'js-cookie'

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
    // const salt = await bcrypt.genSaltSync(SALT);
    // const hash = await bcrypt.hashSync(data.password, salt)
    setInputs({
      email: data.email,
      pass: data.password,
    })

    // Send email activation code
    axios
      .postForm(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/send-authorize-code`,
        { email: data.email }
      )
      .then((res) => {
        handleNext()
      })
      .catch((error) => {
        toast.error(error.response.data.error.message || 'Lỗi không xác định')
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

        <div className="mb-4 flex flex-col gap-3">
          <Typography
            placeholder={undefined}
            variant="h6"
            color="blue-gray"
            className={``}>
            Mật khẩu <span className="text-red-700 font-bold text-lg">*</span>
          </Typography>
          <Input
            type="password"
            {...register('password', {
              required: 'Vui lòng nhập mật khẩu',
            })}
            size="lg"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            crossOrigin={undefined}
          />
          <ErrorInput
            // This is the error message
            errors={errors?.password?.message}
          />
        </div>

        <div className="mb-4 flex flex-col gap-3">
          <Typography
            placeholder={undefined}
            variant="h6"
            color="blue-gray"
            className={``}>
            Nhập lại mật khẩu{' '}
            <span className="text-red-700 font-bold text-lg">*</span>
          </Typography>

          <Input
            type="password"
            size="lg"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            {...register('confirmPassword', {
              required: 'Vui lòng xác nhận lại mật khẩu',
              validate: (value) =>
                value === getValues().password || 'Mật khẩu không khớp',
            })}
            crossOrigin={undefined}
          />
          <ErrorInput
            // This is the error message
            errors={errors?.confirmPassword?.message}
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
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/verify-authorize-code`,
        { email: inputs.email, activationCode: data.activationCode }
      )
      .then(() => {
        // Signup
        axios
          .postForm(`${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/signup`, {
            email: inputs.email,
            pass: inputs.pass,
          })
          .then(() => {
            toast.success('Xác thực thành công')
            // Login
            axios
              .postForm(`${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/login`, {
                email: inputs.email,
                pass: inputs.pass,
              })
              .then((res) => {
                Cookies.set(JWT_COOKIE, res.data.jwt, {
                  expires: JWT_EXPIRED_TIME,
                })
                // Move to next page
                setTimeout(() => router.push('/verify-alumni'), 2500)
              })
          })
      })
      .catch((error) => {
        // failed
        toast.error(error.response.data.error.message || 'Lỗi không xác định')
      })
  }
  const countdownRenderer = ({ seconds }) => {
    return (
      <span className="text-red-500 font-semibold m-auto h-auto absolute right-4 top-1/2 -translate-y-1/2">
        {seconds}s
      </span>
    )
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
        toast.error(error.response.data.error.message || 'Lỗi không xác định')
      })
    setIsCodeExpired(false)
    timer.current = Date.now()
  }

  return (
    <form
      //summit form
      onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-1 flex flex-col gap-6">
        <div
          className={` text-blue-400 italic sm:w-[400px] mt-[2rem] -mb-[1rem]`}>
          Mã xác thực đã được gửi đến {inputs.email} <br />
          Mã có giá trị trong 60s
        </div>
        <Typography
          placeholder={undefined}
          variant="h6"
          color="blue-gray"
          className={` -mb-3`}>
          Mã đăng ký <span className="text-red-700 font-bold text-lg">*</span>
        </Typography>

        <div className="flex relative w-full max-w-[24rem]">
          <Input
            size="lg"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pr-20"
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            {...register('activationCode', {
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
          errors={errors?.activationCode?.message}
        />
      </div>

      <Button
        type="submit"
        placeholder={undefined}
        ripple={true}
        className={`mt-[3rem] w-full bg-blue-800 text-white rounded-md py-4`}>
        Xác thực
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

function SignupForm() {
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
      <Toaster
        containerStyle={{ zIndex: 99999 }}
        toastOptions={{
          success: {
            style: {
              background: '#00a700',
              color: 'white',
            },
          },
          error: {
            style: {
              background: '#ea7b7b',
              color: 'white',
            },
          },
        }}
      />
      <Typography
        variant="h2"
        color="blue-gray"
        placeholder={undefined}
        className="my-8">
        ĐĂNG KÝ
      </Typography>
      <FormContext.Provider
        value={{
          inputs: inputs,
          setInputs: setInputs,
          currentStep: currentStep,
          handleBack: handleBack,
          handleNext: handleNext,
        }}>
        <SignupForm />
      </FormContext.Provider>
      <div className=" mt-[2rem] flex items-center justify-between ">
        <Typography
          placeholder={undefined}
          color="gray"
          className={`text-center font-normal`}>
          Bạn đã có tài khoản ?
        </Typography>
        <Link href="/signin">
          <Button
            placeholder={undefined}
            size="lg"
            variant="outlined"
            className={`font-bold text-blue-700 `}
            ripple={true}>
            Đăng Nhập
          </Button>
        </Link>
      </div>
    </div>
  )
}
