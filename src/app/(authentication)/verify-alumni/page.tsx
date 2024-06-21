'use client'
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import Link from 'next/link'
import {
  Input,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@material-tailwind/react'
import { roboto } from '../../ui/fonts'
import { UseFormRegister, useForm } from 'react-hook-form'
import ErrorInput from '../../ui/error-input'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import Cropper from 'react-easy-crop'
import Cookies from 'js-cookie'
import { FACULTIES, JWT_COOKIE } from '../../constant'
import CustomToaster from '@/app/ui/common/custom-toaster'

const FormContext = createContext(null)

function AvatarModal({ register, getValues, setValue }) {
  const { setInputs, croppedAvatar, setCroppedAvatar } = useContext(FormContext)

  const [open, setOpen] = useState(false)
  const [avatarForCropping, setAvatarForCropping] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const handleOpen = () => {
    if (open) setAvatarForCropping(null)
    setOpen(!open)
  }
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }
  const handleAvatarSelected = (e) => {
    const file = e.target.files[0]

    if (!file) {
      return
    }

    if (file.size > 1024 * 1024 * 5) {
      toast.error('Hãy chọn file có dung lượng thấp hơn 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setAvatarForCropping({ file: file, src: reader.result as string })
    }
    reader.readAsDataURL(file)
  }
  const handleCrop = async () => {
    const croppedImageBitmap = await createImageBitmap(
      avatarForCropping.file,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    )
    const canvas = document.createElement('canvas') as HTMLCanvasElement

    // resize it to the size of our ImageBitmap
    canvas.width = croppedImageBitmap.width
    canvas.height = croppedImageBitmap.height

    // get a bitmaprenderer context
    const ctx = canvas.getContext('bitmaprenderer')
    ctx.transferFromImageBitmap(croppedImageBitmap)

    // get it back as a Blob
    const croppedImageBlob = (await new Promise((res) => {
      if (avatarForCropping.file.type == 'image/jpeg') {
        canvas.toBlob(res, 'image/jpeg', 0.8)
      } else {
        canvas.toBlob(res)
      }
    })) as Blob

    const reader = new FileReader()
    reader.onload = () => {
      setCroppedAvatar(reader.result as string)
    }
    reader.readAsDataURL(croppedImageBlob)

    const originalAvatarFile = getValues('avatar')[0]
    const avatarFile = new File([croppedImageBlob], originalAvatarFile.name, {
      type: originalAvatarFile.type,
    })
    setInputs((values) => ({
      ...values,
      avatar: avatarFile,
    }))

    handleOpen()
  }

  return (
    <>
      <div
        onClick={handleOpen}
        className="w-[180px] h-[180px] rounded-[50%] cursor-pointer border-2 border-[var(--blue-02)]">
        {croppedAvatar && (
          <Image
            className="w-full h-full rounded-[50%]"
            src={croppedAvatar}
            alt="preview-avatar"
            width={180}
            height={180}
          />
        )}
      </div>
      <Dialog
        className="overflow-y-auto scroll-smooth max-h-[90vh]"
        placeholder={undefined}
        open={open}
        handler={handleOpen}>
        <DialogHeader
          tabIndex={0}
          className="border-b-2 border-gray-300 justify-center"
          placeholder={undefined}>
          Chọn ảnh đại diện
        </DialogHeader>
        <DialogBody placeholder={undefined} className="h-[70vh] flex flex-col">
          {!avatarForCropping && (
            <>
              <label
                className="h-full w-full text-[var(--text)] text-xl cursor-pointer font-bold flex justify-center items-center"
                htmlFor="avatar">
                Tải ảnh lên
              </label>
              <input
                className="hidden"
                id="avatar"
                type="file"
                accept="image/png, image/jpeg"
                {...register('avatar', {
                  onChange: handleAvatarSelected,
                })}
              />
            </>
          )}
          {avatarForCropping && (
            <Cropper
              image={avatarForCropping.src}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              zoomWithScroll={false}
              showGrid={false}
              cropShape="round"
            />
          )}
        </DialogBody>
        {avatarForCropping && (
          <div className="flex justify-center">
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => {
                setZoom(+e.target.value)
              }}
              className="w-1/2 hover:cursor-pointer h-[3rem]"
            />
          </div>
        )}
        <DialogFooter
          className="border-t-2 border-gray-300"
          placeholder={undefined}>
          <div className="font-semibold flex gap-4">
            <button
              onClick={handleOpen}
              className="text-blue-800 px-3 py-[6px] rounded-md hover:bg-gray-200 ">
              <span>Hủy</span>
            </button>
            <button
              // type="submit"
              onClick={handleCrop}
              className="bg-blue-700 text-white px-10 py-[6px] rounded-md hover:bg-blue-600">
              <span>Lưu</span>
            </button>
          </div>
        </DialogFooter>
      </Dialog>
    </>
  )
}

function Step1() {
  const { inputs, setInputs, handleNext } = useContext(FormContext)
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      avatar: null,
      fullName: inputs.fullName || '',
    },
  })
  const onSubmit = (data) => {
    setInputs((values) => ({
      ...values,
      fullName: data.fullName,
    }))

    handleNext()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-1 flex flex-col gap-6">
      <p className={`-mb-3 text-[var(--blue-01)] font-semibold`}>
        Ảnh đại diện
      </p>
      <AvatarModal
        register={register}
        getValues={getValues}
        setValue={setValue}
      />

      <p className={`-mb-3 text-[var(--blue-01)] font-semibold`}>
        Họ và tên <span className="text-red-700 text-lg">*</span>
      </p>
      <Input
        size="lg"
        className=" !border-t-blue-gray-200 focus:!border-t-gray-900 w-96"
        {...register('fullName', {
          required: 'Bạn cần phải nhập họ và tên',
          pattern: {
            value: /[a-zA-Z]/,
            message: 'Hãy nhập đúng định dạng tên',
          },
        })}
        labelProps={{
          className: 'before:content-none after:content-none',
        }}
        crossOrigin={undefined}
      />

      <ErrorInput
        // This is the error message
        errors={errors?.fullName?.message}
      />

      <Button
        // onClick={handleNext}
        type="submit"
        placeholder={undefined}
        ripple={true}
        className={`mt-[2rem] w-full bg-blue-800 text-white rounded-md py-4`}>
        Tiếp tục
      </Button>
    </form>
  )
}

function Step2() {
  const router = useRouter()
  const { facultyList, inputs, setInputs, handleBack } = useContext(FormContext)
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      studentId: inputs.studentId || '',
      beginningYear: inputs.beginningYear || '',
      socialMediaLink: inputs.socialMediaLink || '',
      facultyId: inputs.facultyId || '',
    },
  })

  const onSubmit = (data) => {
    // Call API here
    axios
      .postForm(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/alumni-verification`,
        { ...inputs, ...data },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then((res) => {
        toast.success('Thiết lập thành công')
        router.push('/home-page')
      })
      .catch((error) => {
        toast.error(error.response?.data?.error?.message || 'Lỗi không xác định')
      })
  }
  const onBack = () => {
    setInputs((values) => ({ ...values, ...getValues() }))
    handleBack()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-1 flex flex-col gap-6">
      {' '}
      <p className={`-mb-3 text-[var(--blue-01)] font-semibold`}>
        Mã số sinh viên
      </p>
      <Input
        {...register('studentId', {
          pattern: {
            value: /[0-9]/,
            message: 'Hãy nhập đúng định dạng MSSV',
          },
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
        errors={errors?.studentId?.message}
      />
      <p className={`-mb-3 text-[var(--blue-01)] font-semibold `}>
        Năm nhập học{' '}
      </p>
      <Input
        {...register('beginningYear', {
          pattern: {
            value: /[0-9]/,
            message: 'Hãy nhập đúng định dạng năm',
          },
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
        errors={errors?.beginningYear?.message}
      />
      <label
        htmlFor="faculty"
        className={`-mb-3 text-[var(--blue-01)] font-semibold`}>
        Khoa
      </label>
      <select
        className="h-11 col-span-1 hover:cursor-pointer rounded-lg border border-blue-gray-200 pl-3"
        {...register('facultyId')}>
        <option selected value="">
          Không
        </option>
        {facultyList.map((ele) => {
          return (
            <option key={ele.id} value={ele.id}>
              {ele.name}
            </option>
          )
        })}
      </select>
      <p className={`-mb-3 text-[var(--blue-01)] font-semibold`}>
        Trang cá nhân Facebook/ Linkedin
      </p>
      <Input
        size="lg"
        className=" !border-t-blue-gray-200 focus:!border-t-gray-900 w-96"
        {...register('socialMediaLink', {
          pattern: {
            value:
              /(https?:\/)?(www\.)?(?:facebook\.com|linkedin\.com)\/(?:[^\s\/]+)/,
            message: 'Hãy nhập đúng đường dẫn',
          },
        })}
        labelProps={{
          className: 'before:content-none after:content-none',
        }}
        crossOrigin={undefined}
      />
      <ErrorInput
        // This is the error message
        errors={errors?.socialMediaLink?.message}
      />
      <Button
        onClick={onBack}
        placeholder={undefined}
        ripple={true}
        className={`mt-[2rem] w-full bg-blue-800 text-white rounded-md py-4`}>
        Trở lại
      </Button>
      <Button
        type="submit"
        placeholder={undefined}
        ripple={true}
        className={`w-full bg-blue-800 text-white rounded-md py-4`}>
        Hoàn thành
      </Button>
    </form>
  )
}

function AlumniVerificationForm() {
  const { currentStep } = useContext(FormContext)

  return (
    <div className="mt-7 mb-2 w-80 max-w-screen-lg sm:w-96">
      <div className="mb-1 flex flex-col gap-6">
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
    </div>
  )
}

export default function Page() {
  const [inputs, setInputs] = useState({ avatar: null })
  const [currentStep, setCurrentStep] = useState(1)
  const [croppedAvatar, setCroppedAvatar] = useState('/none-avatar.png')
  const [facultyList, setFacultyList] = useState(FACULTIES)

  const handleNext = () => {
    setCurrentStep(currentStep + 1)
  }
  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  return (
    <div
      className={`${roboto.className} w-[20rem] m-auto sm:pt-[10rem] 2xl:pt-0 flex flex-col items-center sm:items-start`}>
      <CustomToaster />
      <p className="text-3xl text-[var(--blue-01)] font-bold">BẮT ĐẦU</p>
      <p className="mt-2 text-[var(--text)] font-medium">
        Hãy thiết lập hồ sơ của bạn. Những thông tin này sẽ giúp chúng tôi xét
        duyệt tài khoản của bạn.
      </p>
      <FormContext.Provider
        value={{
          facultyList: facultyList,
          inputs: inputs,
          setInputs: setInputs,
          currentStep: currentStep,
          handleBack: handleBack,
          handleNext: handleNext,
          croppedAvatar: croppedAvatar,
          setCroppedAvatar: setCroppedAvatar,
        }}>
        <AlumniVerificationForm />
      </FormContext.Provider>
    </div>
  )
}
