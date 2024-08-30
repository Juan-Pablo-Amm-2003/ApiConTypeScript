import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/sqlConfig";

// Definimos los atributos que tiene nuestro modelo
interface CategoryAttributes {
  id: number;
  name: string;
  description?: string; // El atributo es opcional
  createdAt?: Date; // Atributos manejados automáticamente por Sequelize
  updatedAt?: Date; // Atributos manejados automáticamente por Sequelize
}

// Definimos los atributos que son opcionales para la creación
interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, "id"> {}

class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: number;
  public name!: string;
  public description?: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicialización del modelo con Sequelize
Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "Categories",
    underscored: true,
    timestamps: true, // Esto manejará createdAt y updatedAt automáticamente
  }
);

export default Category;
