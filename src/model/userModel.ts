import { Model, DataTypes, Optional } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../config/sqlConfig";

// Definir la interfaz para los atributos del usuario
interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Definir una interfaz para los atributos opcionales (cuando se crea un usuario sin ID)
interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt"> {}

// Definir la clase User que extiende Sequelize Model con los atributos y los opcionales
class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public isAdmin!: boolean;
  public phone?: string;
  public addressLine1?: string;
  public addressLine2?: string;
  public city?: string;
  public state?: string;
  public postalCode?: string;
  public country?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  role: any;

  // Método para hashear la contraseña
  public static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  // Método para validar la contraseña
  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

// Definir el modelo con las columnas de la tabla users
User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Por defecto, no es administrador
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    addressLine1: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    addressLine2: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    postalCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "users",
  }
);

export default User;
