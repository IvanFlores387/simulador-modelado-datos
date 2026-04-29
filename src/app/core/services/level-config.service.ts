import { Injectable, computed, signal } from '@angular/core';
import { ExpectedAttributeModel, ExpectedEntityModel, LevelConfigModel } from '../models/level-config.model';

const libroNivelUnoAttributes: ExpectedAttributeModel[] = [
  {
    name: 'identificador del libro',
    acceptedNames: ['id', 'id_libro', 'codigo_libro', 'clave_libro'],
    type: 'INT',
    isPrimaryKey: true,
    required: true,
    learningPurpose: 'El identificador permite distinguir cada libro de forma única dentro del sistema.',
  },
  {
    name: 'título del libro',
    acceptedNames: ['titulo', 'nombre', 'nombre_libro', 'titulo_libro'],
    type: 'VARCHAR',
    isPrimaryKey: false,
    required: true,
    learningPurpose: 'El título permite registrar el nombre con el que se identifica el libro.',
  },
  {
    name: 'autor del libro',
    acceptedNames: ['autor', 'escritor', 'nombre_autor', 'autor_libro'],
    type: 'VARCHAR',
    isPrimaryKey: false,
    required: true,
    learningPurpose: 'El autor permite conocer quién escribió o creó el libro.',
  },
];

const levels: LevelConfigModel[] = [
  {
    id: 1,
    code: 'nivel_1',
    title: 'Nivel 1: Biblioteca',
    subtitle: 'Construcción de la entidad principal',
    objective: 'Crear la entidad LIBRO con sus atributos básicos: identificador, título y autor.',
    narrativeText: 'Bienvenido. En este nivel debes ayudar a organizar la información de la biblioteca. Tu objetivo es construir correctamente la entidad LIBRO y definir sus atributos principales.',
    expectedEntityName: 'LIBRO',
    expectedAttributes: libroNivelUnoAttributes,
    expectedEntities: [
      {
        name: 'LIBRO',
        acceptedNames: ['libro', 'libros'],
        expectedAttributes: libroNivelUnoAttributes,
        learningPurpose: 'LIBRO es la entidad principal del primer nivel y concentra la información básica de cada obra.',
      },
    ],
  },
  {
    id: 2,
    code: 'nivel_2',
    title: 'Nivel 2: Biblioteca ampliada',
    subtitle: 'Separación de información en varias entidades',
    objective: 'Crear las entidades LIBRO, AUTOR y CATEGORIA para evitar mezclar datos que pertenecen a conceptos diferentes.',
    narrativeText: 'La biblioteca creció y ahora necesita separar mejor su información. En este nivel deberás crear varias entidades para representar libros, autores y categorías de manera ordenada.',
    expectedEntityName: 'LIBRO',
    expectedAttributes: [
      {
        name: 'identificador del libro',
        acceptedNames: ['id_libro', 'id', 'codigo_libro'],
        type: 'INT',
        isPrimaryKey: true,
        required: true,
        learningPurpose: 'Cada libro necesita un identificador único.',
      },
      {
        name: 'título del libro',
        acceptedNames: ['titulo', 'nombre_libro', 'nombre'],
        type: 'VARCHAR',
        isPrimaryKey: false,
        required: true,
        learningPurpose: 'El título describe el nombre del libro.',
      },
      {
        name: 'año de publicación',
        acceptedNames: ['anio_publicacion', 'año_publicacion', 'anio', 'año'],
        type: 'INT',
        isPrimaryKey: false,
        required: true,
        learningPurpose: 'El año de publicación permite ubicar el libro en el tiempo.',
      },
    ],
    expectedEntities: [
      {
        name: 'LIBRO',
        acceptedNames: ['libro', 'libros'],
        learningPurpose: 'LIBRO almacena los datos propios de cada obra.',
        expectedAttributes: [
          {
            name: 'identificador del libro',
            acceptedNames: ['id_libro', 'id', 'codigo_libro'],
            type: 'INT',
            isPrimaryKey: true,
            required: true,
            learningPurpose: 'Cada libro necesita un identificador único.',
          },
          {
            name: 'título del libro',
            acceptedNames: ['titulo', 'nombre_libro', 'nombre'],
            type: 'VARCHAR',
            isPrimaryKey: false,
            required: true,
            learningPurpose: 'El título describe el nombre del libro.',
          },
          {
            name: 'año de publicación',
            acceptedNames: ['anio_publicacion', 'año_publicacion', 'anio', 'año'],
            type: 'INT',
            isPrimaryKey: false,
            required: true,
            learningPurpose: 'El año de publicación permite ubicar el libro en el tiempo.',
          },
        ],
      },
      {
        name: 'AUTOR',
        acceptedNames: ['autor', 'autores'],
        learningPurpose: 'AUTOR separa la información de las personas que escriben libros.',
        expectedAttributes: [
          {
            name: 'identificador del autor',
            acceptedNames: ['id_autor', 'id', 'codigo_autor'],
            type: 'INT',
            isPrimaryKey: true,
            required: true,
            learningPurpose: 'Cada autor necesita una clave única.',
          },
          {
            name: 'nombre del autor',
            acceptedNames: ['nombre', 'nombre_autor', 'autor'],
            type: 'VARCHAR',
            isPrimaryKey: false,
            required: true,
            learningPurpose: 'El nombre permite identificar al autor.',
          },
          {
            name: 'nacionalidad del autor',
            acceptedNames: ['nacionalidad', 'pais', 'país'],
            type: 'VARCHAR',
            isPrimaryKey: false,
            required: true,
            learningPurpose: 'La nacionalidad describe el origen del autor.',
          },
        ],
      },
      {
        name: 'CATEGORIA',
        acceptedNames: ['categoria', 'categoría', 'categorias', 'categorías'],
        learningPurpose: 'CATEGORIA organiza los libros por tema o clasificación.',
        expectedAttributes: [
          {
            name: 'identificador de la categoría',
            acceptedNames: ['id_categoria', 'id_categoría', 'id', 'codigo_categoria'],
            type: 'INT',
            isPrimaryKey: true,
            required: true,
            learningPurpose: 'Cada categoría necesita un identificador único.',
          },
          {
            name: 'nombre de la categoría',
            acceptedNames: ['nombre', 'nombre_categoria', 'nombre_categoría'],
            type: 'VARCHAR',
            isPrimaryKey: false,
            required: true,
            learningPurpose: 'El nombre permite reconocer la categoría.',
          },
          {
            name: 'descripción de la categoría',
            acceptedNames: ['descripcion', 'descripción', 'detalle'],
            type: 'VARCHAR',
            isPrimaryKey: false,
            required: true,
            learningPurpose: 'La descripción explica el alcance de la categoría.',
          },
        ],
      },
    ],
  },
  {
    id: 3,
    code: 'nivel_3',
    title: 'Nivel 3: Relaciones de biblioteca',
    subtitle: 'Entidades conectadas mediante relaciones',
    objective: 'Crear las entidades LIBRO, AUTOR, CATEGORIA, USUARIO y PRESTAMO, además de sus relaciones principales.',
    narrativeText: 'Ahora la biblioteca necesita representar préstamos reales. En este nivel no basta con crear entidades: también deberás indicar cómo se conectan entre sí mediante relaciones y cardinalidades.',
    expectedEntityName: 'LIBRO',
    expectedAttributes: [
      {
        name: 'identificador del libro',
        acceptedNames: ['id_libro', 'id', 'codigo_libro'],
        type: 'INT',
        isPrimaryKey: true,
        required: true,
        learningPurpose: 'Cada libro necesita una clave única.',
      },
      {
        name: 'título del libro',
        acceptedNames: ['titulo', 'nombre_libro', 'nombre'],
        type: 'VARCHAR',
        isPrimaryKey: false,
        required: true,
        learningPurpose: 'El título identifica el libro.',
      },
    ],
    expectedEntities: [
      createEntity('LIBRO', ['libro', 'libros'], [
        createAttribute('identificador del libro', ['id_libro', 'id', 'codigo_libro'], 'INT', true),
        createAttribute('título del libro', ['titulo', 'nombre_libro', 'nombre'], 'VARCHAR', false),
      ]),
      createEntity('AUTOR', ['autor', 'autores'], [
        createAttribute('identificador del autor', ['id_autor', 'id', 'codigo_autor'], 'INT', true),
        createAttribute('nombre del autor', ['nombre', 'nombre_autor', 'autor'], 'VARCHAR', false),
      ]),
      createEntity('CATEGORIA', ['categoria', 'categoría', 'categorias', 'categorías'], [
        createAttribute('identificador de la categoría', ['id_categoria', 'id_categoría', 'id', 'codigo_categoria'], 'INT', true),
        createAttribute('nombre de la categoría', ['nombre', 'nombre_categoria', 'nombre_categoría'], 'VARCHAR', false),
      ]),
      createEntity('USUARIO', ['usuario', 'usuarios'], [
        createAttribute('identificador del usuario', ['id_usuario', 'id', 'codigo_usuario'], 'INT', true),
        createAttribute('nombre del usuario', ['nombre', 'nombre_usuario', 'usuario'], 'VARCHAR', false),
        createAttribute('correo del usuario', ['correo', 'email', 'correo_usuario'], 'VARCHAR', false),
      ]),
      createEntity('PRESTAMO', ['prestamo', 'préstamo', 'prestamos', 'préstamos'], [
        createAttribute('identificador del préstamo', ['id_prestamo', 'id_préstamo', 'id', 'codigo_prestamo'], 'INT', true),
        createAttribute('fecha de préstamo', ['fecha_prestamo', 'fecha_préstamo', 'fecha_inicio'], 'DATE', false),
        createAttribute('fecha de devolución', ['fecha_devolucion', 'fecha_devolución', 'fecha_fin'], 'DATE', false),
      ]),
    ],
    expectedRelations: [
      {
        fromEntity: 'AUTOR',
        toEntity: 'LIBRO',
        name: 'escribe',
        acceptedNames: ['escribe', 'escribio', 'escribió', 'crea', 'autor_libro'],
        cardinality: '1:N',
        learningPurpose: 'Un autor puede escribir varios libros, pero cada libro se asocia a un autor principal en este ejercicio.',
      },
      {
        fromEntity: 'CATEGORIA',
        toEntity: 'LIBRO',
        name: 'clasifica',
        acceptedNames: ['clasifica', 'categoriza', 'pertenece', 'categoria_libro'],
        cardinality: '1:N',
        learningPurpose: 'Una categoría puede agrupar varios libros.',
      },
      {
        fromEntity: 'USUARIO',
        toEntity: 'PRESTAMO',
        name: 'realiza',
        acceptedNames: ['realiza', 'solicita', 'hace', 'usuario_prestamo'],
        cardinality: '1:N',
        learningPurpose: 'Un usuario puede realizar varios préstamos.',
      },
      {
        fromEntity: 'LIBRO',
        toEntity: 'PRESTAMO',
        name: 'se_presta_en',
        acceptedNames: ['se_presta_en', 'prestado_en', 'libro_prestamo', 'se presta en'],
        cardinality: '1:N',
        learningPurpose: 'Un libro puede aparecer en distintos préstamos a lo largo del tiempo.',
      },
    ],
  },
];

function createAttribute(
  name: string,
  acceptedNames: string[],
  type: ExpectedAttributeModel['type'],
  isPrimaryKey: boolean
): ExpectedAttributeModel {
  return {
    name,
    acceptedNames,
    type,
    isPrimaryKey,
    required: true,
    learningPurpose: `Este atributo permite representar ${name}.`,
  };
}

function createEntity(
  name: string,
  acceptedNames: string[],
  expectedAttributes: ExpectedAttributeModel[]
): ExpectedEntityModel {
  return {
    name,
    acceptedNames,
    expectedAttributes,
    learningPurpose: `${name} forma parte del modelo de biblioteca de este nivel.`,
  };
}

@Injectable({
  providedIn: 'root',
})
export class LevelConfigService {
  private readonly levels = levels;
  private readonly currentLevelId = signal<number>(1);

  readonly currentLevel = computed<LevelConfigModel>(() => this.getLevelById(this.currentLevelId()));

  getCurrentLevel(): LevelConfigModel {
    return this.currentLevel();
  }

  getCurrentLevelId(): number {
    return this.currentLevelId();
  }

  getAllLevels(): LevelConfigModel[] {
    return [...this.levels];
  }

  setCurrentLevel(levelId: number): void {
    const exists = this.levels.some((level) => level.id === levelId);
    this.currentLevelId.set(exists ? levelId : 1);
  }

  goToNextLevel(): boolean {
    const nextLevel = this.levels.find((level) => level.id === this.currentLevelId() + 1);

    if (!nextLevel) return false;

    this.currentLevelId.set(nextLevel.id);
    return true;
  }

  private getLevelById(levelId: number): LevelConfigModel {
    return this.levels.find((level) => level.id === levelId) ?? this.levels[0];
  }
}
