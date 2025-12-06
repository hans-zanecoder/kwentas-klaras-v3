import mongoose, { Schema, Document, Model } from 'mongoose'
import { USER_DEPARTMENTS } from '../../app/constants/user/userDepartments'
import { USER_SERVICES } from '../../app/constants/user/userServices'
import type { IProject } from '../types/project/project'

interface IProjectDocument extends IProject, Document {}

const ProjectSchema: Schema = new Schema<IProjectDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    implementingUnit: {
      type: String,
      required: true,
      enum: USER_DEPARTMENTS,
    },
    appropriation: {
      type: Number,
      required: true,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (this: IProjectDocument, value: Date) {
          return value >= this.startDate
        },
        message: 'End date must be after or equal to start date',
      },
    },
    year: {
      type: Number,
      required: true,
      min: 2000,
      max: 2100,
    },
    services: {
      type: String,
      required: true,
      enum: USER_SERVICES,
    },
  },
  {
    timestamps: true,
  }
)

ProjectSchema.index({ name: 1 })
ProjectSchema.index({ implementingUnit: 1 })
ProjectSchema.index({ year: 1 })
ProjectSchema.index({ startDate: 1 })
ProjectSchema.index({ endDate: 1 })

const Project: Model<IProjectDocument> = mongoose.models.Project || mongoose.model<IProjectDocument>('Project', ProjectSchema)

export default Project

