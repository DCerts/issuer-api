import { Router } from 'express';
import { Certificate } from '../models/certificate';
import CertificateService from '../services/certificate';


const router = Router();

router.get('/:regNo', async (req, res) => {
    const regNo = req.params.regNo;
    const certificate = await CertificateService.findByBatchRegNo(regNo);
    res.json(certificate);
});

router.put('/:regNo', async (req, res) => {
    const regNo = req.params.regNo;
    const certificate: Certificate = req.body;
    certificate.regNo = regNo;
    await CertificateService.create(certificate);
    res.sendStatus(201);
});

export default router;