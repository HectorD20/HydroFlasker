/* ============================================
   HYDROFLASKER — Central Products Database
   ============================================ */

export const PRODUCTS = [
  {
    id: 'stanley-quencher-40',
    name: 'Stanley Quencher H2.0 40 oz',
    brand: 'stanley',
    variant: 'Crema',
    price: 35.00,
    priceOld: 45.00,
    sizes: [30, 40],
    colors: [
      { name: 'Crema', hex: '#e3dfd3' },
      { name: 'Cuarzo Rosa', hex: '#f4d9df' },
      { name: 'Eucalipto', hex: '#d2dbd5' },
      { name: 'Negro', hex: '#2a2d34' }
    ],
    badges: [
      { label: 'Oferta', type: 'sale' },
      { label: 'Más Vendido', type: 'bestseller' }
    ],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAF2dT3YeEOr6mVoDRHJfVOICol2zkym_3Z5Q6aql4n5_THtwJHzuLQHD4-ZwtIfu9oIMSMrg-l5s7CIzjwtUmx5iR4rVRY7suyUO4mGLtC0xz3gQN0RwwnXmdXiQFb4jAYTOFMRAbT0I5pje3hq3utvS3CKsEybeSdi5Z_PiNHZmVcM13E2ne9nE5tN_Scu4D5ggHxm4tr4f3or41Z24FrZGqBkx7x7vdfsqTn9N_GfO0SUNJtTBytmxK8VUfqXA0j0H5YLc1c7SY',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAF2dT3YeEOr6mVoDRHJfVOICol2zkym_3Z5Q6aql4n5_THtwJHzuLQHD4-ZwtIfu9oIMSMrg-l5s7CIzjwtUmx5iR4rVRY7suyUO4mGLtC0xz3gQN0RwwnXmdXiQFb4jAYTOFMRAbT0I5pje3hq3utvS3CKsEybeSdi5Z_PiNHZmVcM13E2ne9nE5tN_Scu4D5ggHxm4tr4f3or41Z24FrZGqBkx7x7vdfsqTn9N_GfO0SUNJtTBytmxK8VUfqXA0j0H5YLc1c7SY'
    ],
    description: 'Construido con acero inoxidable reciclado para beber de manera sostenible, nuestro Quencher H2.0 de 40 oz ofrece máxima hidratación con menos recargas. Viajes de trabajo, entrenamientos en el estudio, viajes de un día o en tu porche delantero: querrás este termo a tu lado.',
    isBestseller: true,
    specs: [
      { title: 'Aislamiento Extremo', body: 'El aislamiento al vacío de doble pared mantiene tus bebidas heladas por hasta 48 horas, o calientes por 7 horas.', icon: 'ac_unit' },
      { title: 'Construcción Sostenible', body: 'Construido con 90% de acero inoxidable 18/8 reciclado, reduciendo el impacto ambiental sin sacrificar la durabilidad.', icon: 'recycling' },
      { title: 'Tapa FlowState™', body: 'La tapa avanzada cuenta con una cubierta giratoria con tres posiciones: una abertura para popote, una boca ancha y una tapa de cobertura total.', icon: 'water_drop' }
    ]
  },
  {
    id: 'yeti-rambler-20',
    name: 'Yeti Rambler 20 oz',
    brand: 'yeti',
    variant: 'Azul Marino',
    price: 35.00,
    sizes: [20],
    colors: [
      { name: 'Azul Marino', hex: '#1e3a5f' }
    ],
    badges: [
      { label: 'Más Vendido', type: 'bestseller' }
    ],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0fdHdhpueYGWSKk3cGulsWZGMjt2-LUtHmNUORuX_eO31d3t4tZsBsQIsULIt5gHe-K_aAmH5wq8jP8xBNKU3T6AukrRos5b4D_ZSjyfm2QZCBitFvt2ma6g_n8Gpo_On1bpDute57G2VLqoBPBd6gmDExAUojOKLkb6L1cJb_RPiU6wHagQmyj8b1uFHipXh2vRRWo2e-BIn39P3Dk2NIt1_R_BG2HTLtr3VSf34dnS0t9WDs1HTSJwsW2Tzc3jGSlw0DACsECA',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB0fdHdhpueYGWSKk3cGulsWZGMjt2-LUtHmNUORuX_eO31d3t4tZsBsQIsULIt5gHe-K_aAmH5wq8jP8xBNKU3T6AukrRos5b4D_ZSjyfm2QZCBitFvt2ma6g_n8Gpo_On1bpDute57G2VLqoBPBd6gmDExAUojOKLkb6L1cJb_RPiU6wHagQmyj8b1uFHipXh2vRRWo2e-BIn39P3Dk2NIt1_R_BG2HTLtr3VSf34dnS0t9WDs1HTSJwsW2Tzc3jGSlw0DACsECA'
    ],
    description: 'El legendario vaso de Yeti. Diseñado para resistir caídas de rocas, impactos de ramas y golpes cotidianos. Su aislamiento de doble pared mantiene tu café caliente o tus cocteles helados.',
    isBestseller: true,
    specs: [
      { title: 'Durabilidad Blindada', body: 'El acero inoxidable Duracoat™ resiste golpes, peladuras y grietas, ideal para condiciones extremas.', icon: 'shield' },
      { title: 'Aislamiento al Vacío', body: 'Mantiene tus bebidas calientes o frías hasta el último sorbo gracias a su pared doble.', icon: 'ac_unit' },
      { title: 'Tapa Magnética', body: 'Tapa MagSlider™ magnética y resistente a salpicaduras para una apertura fácil y segura.', icon: 'explore' }
    ]
  },
  {
    id: 'hf-wide-32',
    name: 'Hydro Flask Wide Mouth 32 oz',
    brand: 'hydroflask',
    variant: 'Azul Pacífico',
    price: 44.95,
    sizes: [32, 40],
    colors: [
      { name: 'Azul Pacífico', hex: '#4cd7f6' }
    ],
    badges: [
      { label: 'Más Vendido', type: 'bestseller' }
    ],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7RhSJtiO9TZNoEtM_5ScvXTttYtynrCzfJ_e0QfIHM3uWCYceO8-qViBEgBUb7ZRTRNIxhkUauUJytrMKNKF6g_yk2Uv3izIDpH6_LqS4Pvb32r5it3P9sFSgsE0PiyjEsz9I05WL109SWqy_cL6nsFZhPXtq5qYiRP7FnRVmUTPVpTdus1exqyTYk7bHY7Om103Cm5hqNlhpThdAXJQfBQwC3c0ybNk2gcjh5IWjFk5u50P5FNC65H57ObXewFVzNmptrCdhjVA',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA7RhSJtiO9TZNoEtM_5ScvXTttYtynrCzfJ_e0QfIHM3uWCYceO8-qViBEgBUb7ZRTRNIxhkUauUJytrMKNKF6g_yk2Uv3izIDpH6_LqS4Pvb32r5it3P9sFSgsE0PiyjEsz9I05WL109SWqy_cL6nsFZhPXtq5qYiRP7FnRVmUTPVpTdus1exqyTYk7bHY7Om103Cm5hqNlhpThdAXJQfBQwC3c0ybNk2gcjh5IWjFk5u50P5FNC65H57ObXewFVzNmptrCdhjVA'
    ],
    description: 'Nuestra clásica botella de boca ancha. Ofrece un flujo excelente para una hidratación rápida y es compatible con nuestra gama de tapas deportivas y de popote.',
    isBestseller: true,
    specs: [
      { title: 'TempShield®', body: 'Aislamiento exclusivo por vacío de doble pared que protege la temperatura durante horas.', icon: 'ac_unit' },
      { title: 'Acero de Grado Pro', body: 'Acero inoxidable 18/8 de calidad profesional para asegurar pureza de sabor sin transferencia.', icon: 'verified' },
      { title: 'Libre de BPA', body: 'Construcción libre de BPA y toxinas para una hidratación saludable.', icon: 'eco' }
    ]
  },
  {
    id: 'owala-freesip-24',
    name: 'Owala FreeSip 24 oz',
    brand: 'owala',
    variant: 'Malvavisco Tímido',
    price: 27.99,
    sizes: [24, 32],
    colors: [
      { name: 'Malvavisco Tímido', hex: '#f4d9df' }
    ],
    badges: [],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSbsH_DCG0WTQY4u7UIejp4Tk2C6zTzpSnk59JyKUkViPv6BUyU4zVL6wzBZ2hP7SBlLE4mgiHFZe2brkIWY19z21SwKc9ZX4J5JGfQUpCifd9SMdyX3slo5coD-9ld4CUhw1xu6YcAu_qJiIWlQ50qbAF20F5PDhSR9rp031_xWuHuhikafMA4YLXoRnkRyChMFYvS6HmEzowYbkq-_zOEM4MI4kygYKD_FmI70jGegTID0N9dhR8b06ppgxQakT53SplDfpluJ4',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBSbsH_DCG0WTQY4u7UIejp4Tk2C6zTzpSnk59JyKUkViPv6BUyU4zVL6wzBZ2hP7SBlLE4mgiHFZe2brkIWY19z21SwKc9ZX4J5JGfQUpCifd9SMdyX3slo5coD-9ld4CUhw1xu6YcAu_qJiIWlQ50qbAF20F5PDhSR9rp031_xWuHuhikafMA4YLXoRnkRyChMFYvS6HmEzowYbkq-_zOEM4MI4kygYKD_FmI70jGegTID0N9dhR8b06ppgxQakT53SplDfpluJ4'
    ],
    description: 'La botella que revolucionó la forma de beber. Su tapa patentada FreeSip te permite beber a sorbos de manera vertical a través de su popote integrado o a tragos inclinando la botella.',
    isBestseller: true,
    specs: [
      { title: 'Tapa FreeSip®', body: 'Tapa galardonada 2 en 1 que te da la opción de succionar por popote o tragar libremente.', icon: 'water_drop' },
      { title: 'Botón de Apertura', body: 'Botón de apertura rápida con seguro de bloqueo para evitar derrames accidentales.', icon: 'lock' },
      { title: 'Triple Capa', body: 'Triple aislamiento al vacío que mantiene tu bebida helada hasta por 24 horas continuas.', icon: 'ac_unit' }
    ]
  },
  {
    id: 'commuter-30',
    name: 'The Commuter 30oz',
    brand: 'stanley',
    variant: 'Edición Negro Mate',
    price: 35.00,
    sizes: [30],
    colors: [
      { name: 'Negro Mate', hex: '#1e293b' },
      { name: 'Azul Marino', hex: '#1e3a5f' }
    ],
    badges: [
      { label: 'Frío por 24h', type: 'info' }
    ],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnMmgTJG17iNWyp2Tk_ZbNybk3FmB7WRESWF1AmAaPQmXNVr1k3n_oNUEGmnWDLGZFMT10V4SFOanFMVrQZSPtmTnJz9mHJnoq6jH6XAE1BPsK3Enj4nhwkLp4iIX-C6zZgf85ML1a4jSE_-Dli_LeP0GN2EFOW1_KtokrmP13j0bnqoBef5TajMk_2oUMgCouT1ZzFuyQnEpciV6D1FxamGF29Rgy7n7GmwPYVdriTHPNEszkMr7FGO7w-X-jjaBOmxzch3Dln7o',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBnMmgTJG17iNWyp2Tk_ZbNybk3FmB7WRESWF1AmAaPQmXNVr1k3n_oNUEGmnWDLGZFMT10V4SFOanFMVrQZSPtmTnJz9mHJnoq6jH6XAE1BPsK3Enj4nhwkLp4iIX-C6zZgf85ML1a4jSE_-Dli_LeP0GN2EFOW1_KtokrmP13j0bnqoBef5TajMk_2oUMgCouT1ZzFuyQnEpciV6D1FxamGF29Rgy7n7GmwPYVdriTHPNEszkMr7FGO7w-X-jjaBOmxzch3Dln7o'
    ],
    description: 'El termo ideal para tus viajes diarios de trabajo o estudio. Diseñado con una forma delgada para caber en cualquier portavasos de coche y con una tapa giratoria hermética.',
    isBestseller: false,
    specs: [
      { title: 'Ideal para Viajar', body: 'Su base angosta encaja a la perfección en la mayoría de portavasos de autos.', icon: 'directions_car' },
      { title: 'Flujo Regulado', body: 'Tapa giratoria con 3 posiciones para beber con comodidad y sin salpicar.', icon: 'water_drop' },
      { title: 'Acero de Grado 18/8', body: 'Resiste golpes y óxido. Construido para durar toda una vida de trayectos.', icon: 'verified' }
    ]
  },
  {
    id: 'basecamp-40',
    name: 'Basecamp Flask 40oz',
    brand: 'hydroflask',
    variant: 'Blanco Ártico',
    price: 45.00,
    sizes: [40],
    colors: [
      { name: 'Blanco Ártico', hex: '#f5f5f5' },
      { name: 'Naranja Fuego', hex: '#fe5e1e' }
    ],
    badges: [],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCg462SB--TbsuEiS2ns8KIEReup8LlAEiOPVffj7fQ-uLkLSQhcOmjvXXGAZXm5Ast6bJFi7g4XgJNIiFjxQvG4qyzcBdxtF-dnne6h-L72jHKnbjSh5l1gHSmzZQyftgnX2859_poApNfWRlqtasmHaYSSdR79BrQ1BFnr8g2d89z26RvWNhodtwcBz-xPCqRqzyZ8n-KRcxjpxUYMzOWHr0mS38O5CX8M015hcrS300eg9vWrCXoWu-_9FydVh-n1JwHJ6MERx0',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCg462SB--TbsuEiS2ns8KIEReup8LlAEiOPVffj7fQ-uLkLSQhcOmjvXXGAZXm5Ast6bJFi7g4XgJNIiFjxQvG4qyzcBdxtF-dnne6h-L72jHKnbjSh5l1gHSmzZQyftgnX2859_poApNfWRlqtasmHaYSSdR79BrQ1BFnr8g2d89z26RvWNhodtwcBz-xPCqRqzyZ8n-KRcxjpxUYMzOWHr0mS38O5CX8M015hcrS300eg9vWrCXoWu-_9FydVh-n1JwHJ6MERx0'
    ],
    description: 'Construido para el aire libre. La botella Basecamp ofrece un volumen generoso y aislamiento al vacío de doble pared TempShield para mantener tus bebidas heladas incluso bajo el sol del campamento.',
    isBestseller: false,
    specs: [
      { title: 'Volumen Basecamp', body: 'Capacidad masiva de 40 oz para largas jornadas de campamento o caminatas grupales.', icon: 'groups' },
      { title: 'Aislamiento Máximo', body: 'TempShield mantiene tus líquidos fríos por 24 horas y calientes hasta por 12 horas.', icon: 'ac_unit' },
      { title: 'Toma Cómoda', body: 'Manija de transporte integrada flexible para cargar con facilidad o enganchar en mochilas.', icon: 'shopping_bag' }
    ]
  },
  {
    id: 'trailblazer-20',
    name: 'Trailblazer 20oz',
    brand: 'hydroflask',
    variant: 'Naranja Fuego',
    price: 28.00,
    sizes: [20],
    colors: [
      { name: 'Naranja Fuego', hex: '#ff5722' }
    ],
    badges: [
      { label: 'Más Vendido', type: 'sold' }
    ],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqGIMtk4qhd5_JQyv3ToiiiOzmdr7gVCTqBFxWsEnN1PZM0G1qf_PChDv-YksK5pL8e9qK9VTdotHFNj4a2Y4RhWmgXrg9kVpqoBceQ71rs0hY4lPjE6v1qywcOM-XBUc434o-paydLR6z-4iwZqaikn3ysiqeo85e4yFNsO_F3WqD9UlL2BV9AJtGB2byxcvJi5k6WBSOGrq5AFhh_MmL2A0yRFr2cbsV4sWjSnv3mFF3IY-RhseAoy7ziqdK_nw7cwXqhMADtvM',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBqGIMtk4qhd5_JQyv3ToiiiOzmdr7gVCTqBFxWsEnN1PZM0G1qf_PChDv-YksK5pL8e9qK9VTdotHFNj4a2Y4RhWmgXrg9kVpqoBceQ71rs0hY4lPjE6v1qywcOM-XBUc434o-paydLR6z-4iwZqaikn3ysiqeo85e4yFNsO_F3WqD9UlL2BV9AJtGB2byxcvJi5k6WBSOGrq5AFhh_MmL2A0yRFr2cbsV4sWjSnv3mFF3IY-RhseAoy7ziqdK_nw7cwXqhMADtvM'
    ],
    description: 'Ligera, duradera y ultra-portátil. Diseñada para senderistas y exploradores que necesitan mantenerse hidratados sin cargar peso adicional en sus mochilas.',
    isBestseller: false,
    specs: [
      { title: 'Peso Pluma', body: 'Diseño aligerado que reduce el peso en tu espalda sin comprometer el aislamiento.', icon: 'fitness_center' },
      { title: 'Tapa a Prueba de Fugas', body: 'Tapa hermética de rosca que evita cualquier goteo, ideal para llevar tumbado en la mochila.', icon: 'water_drop' },
      { title: 'Recubrimiento Rugoso', body: 'Pintura en polvo con agarre especial para evitar que se resbale con el sudor o humedad.', icon: 'texture' }
    ]
  },
  {
    id: 'sport-cap',
    name: 'Tapa Deportiva Aislada',
    brand: 'hydroflask',
    variant: 'Color: Negro',
    price: 12.95,
    sizes: [],
    colors: [
      { name: 'Negro', hex: '#000000' }
    ],
    badges: [],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6cbKHvrzWs3pbNhYfgD-pEIegQTJd9bIKuu19wVJyX8tIWfoxj4JNrG7x0l9ropTKYQDonrG_jgms-C18Wp7kFrJ0bePR6M_6nnjmXvpP7Ym9Hh7exnQ-OpLUHS8diSACh96unGd69NBWqnoC1s0fh6F2wW77RZeYQ39nr549V1f5x-3optlSdEISgJQEWyz5XuwdmSRjNXe_zsI5iZlIx3RM4ozHNR5Mxe57GgnSygX_spFoVHpyzChB35Q7wY_Oju1cUO2wHDU',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA6cbKHvrzWs3pbNhYfgD-pEIegQTJd9bIKuu19wVJyX8tIWfoxj4JNrG7x0l9ropTKYQDonrG_jgms-C18Wp7kFrJ0bePR6M_6nnjmXvpP7Ym9Hh7exnQ-OpLUHS8diSACh96unGd69NBWqnoC1s0fh6F2wW77RZeYQ39nr549V1f5x-3optlSdEISgJQEWyz5XuwdmSRjNXe_zsI5iZlIx3RM4ozHNR5Mxe57GgnSygX_spFoVHpyzChB35Q7wY_Oju1cUO2wHDU'
    ],
    description: 'Tapa de repuesto con aislamiento para mantener tu agua bien fría durante los entrenamientos más intensos.',
    isBestseller: false,
    specs: [
      { title: 'Tapa Deportiva', body: 'Apertura de pivote fácil de abrir con una sola mano.', icon: 'sports_run' },
      { title: 'Flujo Rápido', body: 'Perfecta para reponer líquidos rápidamente a mitad de tu actividad.', icon: 'speed' }
    ]
  }
];

export function getProductById(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}
