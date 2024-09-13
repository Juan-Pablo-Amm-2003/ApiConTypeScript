import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sqlConfig";

export class SalesModel extends Model {
  public id!: number;
  public userId!: number;
  public snapshot!: string;
  public total!: number;
  public pdfUrl?: string; // Nuevo campo para almacenar la URL del PDF
  public createdAt!: Date;
}

SalesModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    snapshot: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    pdfUrl: {
      // Nuevo campo en la base de datos
      type: DataTypes.STRING,
      allowNull: true, // Puede ser NULL si aún no se ha generado o subido el PDF
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "sales",
    timestamps: false,
  }
);

export default SalesModel;
